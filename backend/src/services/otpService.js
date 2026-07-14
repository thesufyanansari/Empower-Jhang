import { PrismaClient } from '@prisma/client';
import { sendOtpEmail } from './emailService.js';
import { logger } from '../utils/logger.js';
import crypto from 'crypto';

const prisma = new PrismaClient();

export const otpService = {
  /**
   * Generates a rate-limited, secure OTP and logs metadata.
   */
  async generateAndSendOtp(email, ip = null, userAgent = null) {
    const cleanEmail = email.toLowerCase().trim();

    // 1. Email check: Verify if email already registered
    const emailExists = await prisma.communityMember.findFirst({
      where: { email: cleanEmail, status: { not: 'Deleted' } }
    });
    if (emailExists) {
      throw new Error('This email address is already registered with Empower Jhang.');
    }

    // 2. Email rate limit check: Max 3 OTP requests in 15 minutes
    const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000);
    const recentOtpsCount = await prisma.emailOtp.count({
      where: {
        email: cleanEmail,
        created_at: { gte: fifteenMinsAgo }
      }
    });

    if (recentOtpsCount >= 3) {
      logger.warn(`[OTP Rate Limit] Suspicious rate of requests for email: ${cleanEmail} from IP: ${ip}`);
      throw new Error('Too many verification codes requested. You can only request up to 3 codes within 15 minutes.');
    }

    // 3. Resend check: Throttle requests within 60s resend timer
    const lastOtp = await prisma.emailOtp.findFirst({
      where: { email: cleanEmail },
      orderBy: { created_at: 'desc' }
    });

    if (lastOtp) {
      const timeDiff = Date.now() - new Date(lastOtp.created_at).getTime();
      const resendLimit = parseInt(process.env.OTP_RESEND_TIME || '60000', 10);
      if (timeDiff < resendLimit) {
        throw new Error(`Please wait ${Math.ceil((resendLimit - timeDiff) / 1000)} seconds before requesting a new code.`);
      }

      // Invalidate the previous OTP immediately
      await prisma.emailOtp.deleteMany({
        where: { email: cleanEmail }
      });
      logger.info(`[OTP Resend] Invalidated previous code for email: ${cleanEmail}`);
    }

    // 4. Generate random 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + parseInt(process.env.OTP_EXPIRY || '600000', 10)); // default 10 mins

    // Hash code securely (SHA-256)
    const hashedCode = crypto.createHash('sha256').update(code).digest('hex');

    // 5. Store OTP record in database with metadata
    await prisma.emailOtp.create({
      data: {
        email: cleanEmail,
        otp: hashedCode,
        expires_at: expiresAt,
        ip_address: ip,
        user_agent: userAgent
      }
    });

    logger.info(`[OTP Generated] Secure code created for email: ${cleanEmail}`);

    // 6. Send email via Brevo API
    try {
      await sendOtpEmail(cleanEmail, code);
      logger.info(`[OTP Sent] Code successfully dispatched to email: ${cleanEmail}`);
    } catch (err) {
      logger.error(`[OTP Error] Failed to send email to ${cleanEmail}: ${err.message}`);
      throw new Error('Failed to deliver verification email. Please try again.');
    }

    return { message: 'Verification OTP sent successfully.' };
  },

  /**
   * Verifies the OTP, manages attempt limits, and consumes OTP.
   */
  async verifyOtp(email, code) {
    const cleanEmail = email.toLowerCase().trim();
    const inputCode = code.trim();

    // Find the latest active OTP record for this email
    const activeOtp = await prisma.emailOtp.findFirst({
      where: {
        email: cleanEmail,
        expires_at: { gt: new Date() }
      },
      orderBy: { created_at: 'desc' }
    });

    if (!activeOtp) {
      logger.warn(`[OTP Failed] No active verification code found for email: ${cleanEmail}`);
      throw new Error('No active verification code found. Please request a new code.');
    }

    // Check attempts limit (Max 5 attempts)
    if (activeOtp.attempts >= 5) {
      // Invalidate OTP (delete it)
      await prisma.emailOtp.deleteMany({
        where: { email: cleanEmail }
      });
      logger.warn(`[OTP Expired] Verification code invalidated due to excessive failed attempts for email: ${cleanEmail}`);
      throw new Error('Too many failed verification attempts. Please request a new verification code.');
    }

    // Hash input code securely to compare
    const hashedInput = crypto.createHash('sha256').update(inputCode).digest('hex');

    // Check if code matches
    if (activeOtp.otp !== hashedInput) {
      // Increment attempt count
      const updatedOtp = await prisma.emailOtp.update({
        where: { id: activeOtp.id },
        data: { attempts: { increment: 1 } }
      });

      const remaining = 5 - updatedOtp.attempts;
      logger.warn(`[OTP Incorrect] Failed attempt (${updatedOtp.attempts}/5) for email: ${cleanEmail}`);

      if (remaining <= 0) {
        await prisma.emailOtp.deleteMany({
          where: { email: cleanEmail }
        });
        throw new Error('Too many failed verification attempts. Please request a new verification code.');
      }

      throw new Error(`Incorrect verification code. Please try again. Attempts remaining: ${remaining}`);
    }

    // Mark as verified and log success
    await prisma.emailOtp.deleteMany({
      where: { email: cleanEmail }
    });

    logger.info(`[OTP Verified] Email verified successfully: ${cleanEmail}`);

    // Check if admin exists
    const admin = await prisma.admin.findFirst({
      where: { email: cleanEmail, status: 'Active' }
    });

    // Check if member exists
    const member = await prisma.communityMember.findFirst({
      where: { email: cleanEmail, status: { not: 'Deleted' } }
    });

    const isAdmin = !!admin;
    const exists = !!member;

    return {
      verified: true,
      is_admin: isAdmin,
      exists,
      id: isAdmin ? admin.id : (exists ? member.id : null),
      member_id: isAdmin ? null : (exists ? member.member_id : null),
      email: cleanEmail
    };
  }
};
