import { otpService } from '../services/otpService.js';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

/**
 * Generates and sends a 6-digit OTP code to the requested email.
 */
export const sendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];
    
    const result = await otpService.generateAndSendOtp(email, ip, userAgent);
    return res.status(200).json({
      success: true,
      message: result.message,
      data: null
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Resends a fresh 6-digit OTP code, invalidating previous keys.
 */
export const resendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];

    const result = await otpService.generateAndSendOtp(email, ip, userAgent);
    return res.status(200).json({
      success: true,
      message: result.message,
      data: null
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Verifies the 6-digit OTP code.
 */
export const verifyOtp = async (req, res, next) => {
  try {
    const { email, code } = req.body;
    const result = await otpService.verifyOtp(email, code);

    if (result.verified && result.is_admin) {
      // Sign JWT token for admin
      const token = jwt.sign(
        {
          id: result.id,
          email: result.email,
          is_admin: true
        },
        process.env.JWT_SECRET || 'super-secret-admin-token-key',
        { expiresIn: '7d' }
      );

      // Set secure HTTP-only cookie
      res.cookie('admin_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Email verified successfully.',
      data: result
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Log in as admin using email and password.
 */
export const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
        errors: []
      });
    }

    const admin = await prisma.admin.findUnique({
      where: { email: email.trim().toLowerCase() }
    });

    if (!admin || admin.status !== 'Active') {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials or account deactivated.',
        errors: []
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials or account deactivated.',
        errors: []
      });
    }

    // Sign JWT token
    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
        role: admin.role,
        is_admin: true
      },
      process.env.JWT_SECRET || 'super-secret-admin-token-key',
      { expiresIn: '7d' }
    );

    // Set secure HTTP-only cookie
    res.cookie('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    // Update last login
    await prisma.admin.update({
      where: { id: admin.id },
      data: { last_login: new Date() }
    });

    // Log Activity
    await prisma.activityLog.create({
      data: {
        user_type: 'Admin',
        user_id: admin.id,
        action: 'Login',
        module: 'Auth',
        ip_address: req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Admin authenticated successfully.',
      data: {
        id: admin.id,
        email: admin.email,
        full_name: admin.full_name,
        role: admin.role
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Logs out the admin by clearing cookie.
 */
export const logout = async (req, res, next) => {
  try {
    res.clearCookie('admin_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    return res.status(200).json({
      success: true,
      message: 'Logged out successfully.',
      data: null
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Checks for an active admin session and returns admin info.
 */
export const getSession = async (req, res, next) => {
  const token = req.cookies.admin_token;
  if (!token) {
    return res.status(200).json({
      success: true,
      message: 'No active session.',
      data: { authenticated: false }
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super-secret-admin-token-key');
    const adminUser = await prisma.admin.findUnique({
      where: { id: decoded.id }
    });
    if (!adminUser || adminUser.status !== 'Active') {
      return res.status(200).json({
        success: true,
        message: 'Session invalid or unauthorized.',
        data: { authenticated: false }
      });
    }

    const member = await prisma.communityMember.findFirst({
      where: { email: adminUser.email, status: { not: 'Deleted' } }
    });

    return res.status(200).json({
      success: true,
      message: 'Session is active.',
      data: {
        authenticated: true,
        admin: {
          id: adminUser.id,
          email: adminUser.email,
          full_name: adminUser.full_name,
          member_id: member ? member.member_id : null
        }
      }
    });
  } catch (err) {
    return res.status(200).json({
      success: true,
      message: 'Session expired or invalid.',
      data: { authenticated: false }
    });
  }
};
