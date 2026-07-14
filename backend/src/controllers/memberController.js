import { memberService } from '../services/memberService.js';
import { cardService } from '../services/cardService.js';
import jwt from 'jsonwebtoken';

/**
 * Register a new member.
 */
export const register = async (req, res, next) => {
  try {
    const newUser = await memberService.registerMember(req.body, req.file);

    return res.status(201).json({
      success: true,
      message: 'Member profile created successfully! Admin will review your profile shortly.',
      data: {
        member: newUser
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Fetch member profile by member_id (Secures private fields and pending profiles).
 */
export const getProfileByMemberId = async (req, res, next) => {
  try {
    const { memberId } = req.params;
    const user = await memberService.getProfile(memberId);
    
    // Check if profile is not active (e.g. Pending, Suspended)
    if (user.status !== 'Active') {
      let isOwner = false;
      let isAdmin = false;
      
      const clientSecretId = req.headers['x-profile-id'];
      if (user.id === clientSecretId) {
        isOwner = true;
      }
      
      const adminToken = req.cookies.admin_token;
      if (adminToken) {
        try {
          const decoded = jwt.verify(adminToken, process.env.JWT_SECRET || 'super-secret-admin-token-key-change-in-production');
          if (decoded.is_admin || decoded.role === 'Administrator') {
            isAdmin = true;
          }
        } catch (e) {
          // ignore
        }
      }
      
      if (!isOwner && !isAdmin) {
        return res.status(403).json({
          success: false,
          message: 'This profile is pending administrator approval and is currently private.',
          errors: []
        });
      }
    }
    
    // Safe return: remove private fields if not owner or admin
    let isOwnerOrAdmin = false;
    const clientSecretId = req.headers['x-profile-id'];
    if (user.id === clientSecretId) isOwnerOrAdmin = true;
    
    const adminToken = req.cookies.admin_token;
    if (adminToken) {
      try {
        const decoded = jwt.verify(adminToken, process.env.JWT_SECRET || 'super-secret-admin-token-key-change-in-production');
        if (decoded.is_admin || decoded.role === 'Administrator') isOwnerOrAdmin = true;
      } catch (e) {
        // ignore
      }
    }

    const cleanUser = { ...user };
    if (!isOwnerOrAdmin) {
      // strictly hide private information from public
      delete cleanUser.email;
      delete cleanUser.whatsapp;
      delete cleanUser.date_of_birth;
      delete cleanUser.father_name;
      delete cleanUser.address;
    }

    return res.status(200).json({
      success: true,
      message: 'Member profile retrieved successfully.',
      data: cleanUser
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Update member profile.
 */
export const updateProfile = async (req, res, next) => {
  try {
    const { memberId } = req.params;
    const clientSecretId = req.headers['x-profile-id'];

    const user = await memberService.getProfile(memberId);

    // Verify ownership or administrator status
    let isAdmin = false;
    const adminToken = req.cookies.admin_token;
    if (adminToken) {
      try {
        const decoded = jwt.verify(adminToken, process.env.JWT_SECRET || 'super-secret-admin-token-key-change-in-production');
        if (decoded.is_admin || decoded.role === 'Administrator') {
          isAdmin = true;
        }
      } catch (e) {
        // ignore
      }
    }

    if (user.id !== clientSecretId && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You do not own this profile.',
        errors: []
      });
    }

    const updatedUser = await memberService.updateProfile(memberId, req.body);
    
    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully!',
      data: {
        member: updatedUser
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Apply to volunteer.
 */
export const applyVolunteer = async (req, res, next) => {
  try {
    const { memberId } = req.params;
    const clientSecretId = req.headers['x-profile-id'];
    const user = await memberService.getProfile(memberId);

    if (user.id !== clientSecretId) {
      return res.status(403).json({ success: false, message: 'Access denied. You do not own this profile.' });
    }

    const updated = await memberService.applyVolunteer(memberId, req.body);
    return res.status(200).json({
      success: true,
      message: 'Volunteer application submitted successfully for review!',
      data: updated
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Apply to become a mentor.
 */
export const applyMentor = async (req, res, next) => {
  try {
    const { memberId } = req.params;
    const clientSecretId = req.headers['x-profile-id'];
    const user = await memberService.getProfile(memberId);

    if (user.id !== clientSecretId) {
      return res.status(403).json({ success: false, message: 'Access denied. You do not own this profile.' });
    }

    const updated = await memberService.applyMentor(memberId, req.body);
    return res.status(200).json({
      success: true,
      message: 'Mentor application submitted successfully for review!',
      data: updated
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Generate and stream member card PDF.
 */
export const downloadCardPdf = async (req, res, next) => {
  try {
    const { memberId } = req.params;
    const user = await memberService.getProfile(memberId);
    const pdfBuffer = await cardService.generateMemberCardPdf(user);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="EJ_Card_${memberId}.pdf"`);
    return res.send(pdfBuffer);
  } catch (err) {
    next(err);
  }
};

/**
 * Generate and stream member profile QR code.
 */
export const downloadCardQr = async (req, res, next) => {
  try {
    const { memberId } = req.params;
    const qrBuffer = await cardService.generateQrCodeBuffer(memberId);

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', `attachment; filename="EJ_QR_${memberId}.png"`);
    return res.send(qrBuffer);
  } catch (err) {
    next(err);
  }
};

/**
 * Returns dynamic community statistics.
 */
export const getMemberCount = async (req, res, next) => {
  try {
    const result = await memberService.getMemberCount();
    return res.status(200).json({
      success: true,
      message: 'Statistics retrieved successfully.',
      data: result
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Fetch approved members for public directory (searchable/filterable).
 */
export const getPublicMembers = async (req, res, next) => {
  try {
    const { search, skill, district } = req.query;
    const members = await memberService.getPublicMembers({ search, skill, district });
    return res.status(200).json({ success: true, data: members });
  } catch (err) {
    next(err);
  }
};

/**
 * Fetch approved volunteers for team page.
 */
export const getPublicVolunteers = async (req, res, next) => {
  try {
    const volunteers = await memberService.getPublicVolunteers();
    return res.status(200).json({ success: true, data: volunteers });
  } catch (err) {
    next(err);
  }
};

/**
 * Fetch approved mentors for team page.
 */
export const getPublicMentors = async (req, res, next) => {
  try {
    const mentors = await memberService.getPublicMentors();
    return res.status(200).json({ success: true, data: mentors });
  } catch (err) {
    next(err);
  }
};

/**
 * Fetch approved leadership team members.
 */
export const getPublicLeadership = async (req, res, next) => {
  try {
    const leadership = await memberService.getPublicLeadership();
    return res.status(200).json({ success: true, data: leadership });
  } catch (err) {
    next(err);
  }
};
