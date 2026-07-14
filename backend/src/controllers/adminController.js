import { memberService } from '../services/memberService.js';
import { settingsService } from '../services/settingsService.js';
import { PrismaClient } from '@prisma/client';
import os from 'os';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

/**
 * Fetch overview statistics for the admin dashboard.
 */
export const getStatistics = async (req, res, next) => {
  try {
    const stats = await memberService.getAdminStatistics();
    return res.status(200).json({
      success: true,
      message: 'Statistics retrieved successfully.',
      data: stats
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Fetch searchable, filterable list of members.
 */
export const getMembers = async (req, res, next) => {
  try {
    const { is_verified, is_active, status } = req.query;
    const filters = {};

    if (is_verified !== undefined && is_verified !== '') {
      filters.is_verified = is_verified === 'true';
    }

    if (is_active !== undefined && is_active !== '') {
      filters.is_active = is_active === 'true';
    }

    if (status !== undefined && status !== '') {
      filters.status = status;
    }

    const members = await memberService.getAdminMembers(filters);
    return res.status(200).json({
      success: true,
      message: 'Members retrieved successfully.',
      data: members
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Toggles member verification status.
 */
export const toggleVerifyMember = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await memberService.toggleVerifyMember(id);

    return res.status(200).json({
      success: true,
      message: `Member verification status updated to ${updated.is_verified ? 'Verified' : 'Unverified'}.`,
      data: updated
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Toggles member suspend / active status.
 */
export const toggleSuspendMember = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await memberService.toggleSuspendMember(id);

    return res.status(200).json({
      success: true,
      message: `Member active status updated to ${updated.is_active ? 'Active' : 'Suspended'}.`,
      data: updated
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Irreversibly delete a member profile.
 */
export const deleteMember = async (req, res, next) => {
  try {
    const { id } = req.params;
    await memberService.deleteMember(id);

    return res.status(200).json({
      success: true,
      message: 'Member profile deleted successfully.',
      data: null
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Fetch global website settings.
 */
export const getSettings = async (req, res, next) => {
  try {
    const settings = await settingsService.getSettings();
    return res.status(200).json({
      success: true,
      message: 'Settings retrieved successfully.',
      data: settings
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Update global website settings.
 */
export const updateSettings = async (req, res, next) => {
  try {
    const settings = await settingsService.updateSettings(req.body);
    return res.status(200).json({
      success: true,
      message: 'Settings updated successfully.',
      data: settings
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Fetch community social links.
 */
export const getLinks = async (req, res, next) => {
  try {
    const links = await settingsService.getLinks();
    return res.status(200).json({
      success: true,
      message: 'Links retrieved successfully.',
      data: links
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Update community social links.
 */
export const updateLinks = async (req, res, next) => {
  try {
    const links = await settingsService.updateLinks(req.body);
    return res.status(200).json({
      success: true,
      message: 'Links updated successfully.',
      data: links
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Fetch announcements list.
 */
export const getAnnouncements = async (req, res, next) => {
  try {
    const announcements = await settingsService.getAnnouncements();
    return res.status(200).json({
      success: true,
      message: 'Announcements retrieved successfully.',
      data: announcements
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Publish a new announcement.
 */
export const createAnnouncement = async (req, res, next) => {
  try {
    const creatorAdminId = req.admin.id;
    const announcement = await settingsService.createAnnouncement(req.body, creatorAdminId);
    return res.status(201).json({
      success: true,
      message: 'Announcement published successfully.',
      data: { announcement }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Delete a published announcement.
 */
export const deleteAnnouncement = async (req, res, next) => {
  try {
    const { id } = req.params;
    await settingsService.deleteAnnouncement(id);
    return res.status(200).json({
      success: true,
      message: 'Announcement deleted successfully.',
      data: null
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Fetch list of volunteers and requests.
 */
export const getVolunteers = async (req, res, next) => {
  try {
    const volunteers = await prisma.communityMember.findMany({
      where: {
        OR: [
          { is_volunteer: true },
          { volunteer_status: { in: ['Pending', 'Approved', 'Rejected'] } }
        ]
      },
      orderBy: { registration_date: 'desc' }
    });

    return res.status(200).json({
      success: true,
      message: 'Volunteers retrieved successfully.',
      data: volunteers
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Review volunteer application status.
 */
export const reviewVolunteer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    let roleId = undefined;
    if (status === 'Approved') {
      const defaultRole = await prisma.role.findFirst({ where: { key: 'volunteer' } });
      if (defaultRole) {
        roleId = defaultRole.id;
      }
    }

    const member = await prisma.communityMember.update({
      where: { id },
      data: {
        volunteer_status: status,
        is_volunteer: status === 'Approved',
        volunteer_notes: notes || '',
        roleId: roleId || undefined
      }
    });

    // Log Activity
    await prisma.activityLog.create({
      data: {
        user_type: 'Admin',
        user_id: req.admin.id,
        action: `Review Volunteer: ${status}`,
        module: 'Volunteers',
        ip_address: req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress
      }
    });

    return res.status(200).json({
      success: true,
      message: `Volunteer application status updated to ${status}.`,
      data: member
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Assign department and role details to volunteer.
 */
export const assignVolunteer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { department, role } = req.body;

    const member = await prisma.communityMember.update({
      where: { id },
      data: {
        volunteer_department: department,
        volunteer_role: role
      }
    });

    // Log Activity
    await prisma.activityLog.create({
      data: {
        user_type: 'Admin',
        user_id: req.admin.id,
        action: `Assign Volunteer Department/Role`,
        module: 'Volunteers',
        ip_address: req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Volunteer roles updated successfully.',
      data: member
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Fetch audit Activity logs.
 */
export const getActivityLogs = async (req, res, next) => {
  try {
    const logs = await prisma.activityLog.findMany({
      orderBy: { created_at: 'desc' },
      take: 100
    });

    return res.status(200).json({
      success: true,
      message: 'Activity logs retrieved successfully.',
      data: logs
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Fetch live system health metrics.
 */
export const getSystemHealth = async (req, res, next) => {
  try {
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;

    // Perform dummy/simple db check
    await prisma.$queryRaw`SELECT 1`;

    return res.status(200).json({
      success: true,
      message: 'System health retrieved successfully.',
      data: {
        server_status: 'Healthy',
        node_version: process.version,
        platform: os.platform(),
        memory_usage: {
          total: (totalMemory / 1024 / 1024 / 1024).toFixed(2) + ' GB',
          used: (usedMemory / 1024 / 1024 / 1024).toFixed(2) + ' GB',
          free: (freeMemory / 1024 / 1024 / 1024).toFixed(2) + ' GB'
        },
        database: 'Connected',
        email_api: 'Operational',
        uptime: (process.uptime() / 60).toFixed(2) + ' Minutes'
      }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'System health issues detected.',
      errors: [err.message]
    });
  }
};

/**
 * Fetch and trigger mock/local system backups.
 */
export const getBackups = async (req, res, next) => {
  try {
    const backupDir = path.join(process.cwd(), 'uploads/backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const files = fs.readdirSync(backupDir);
    const backups = files.map(file => {
      const stats = fs.statSync(path.join(backupDir, file));
      return {
        file_name: file,
        file_size: (stats.size / 1024).toFixed(2) + ' KB',
        created_at: stats.mtime
      };
    });

    return res.status(200).json({
      success: true,
      message: 'Backups history retrieved.',
      data: backups
    });
  } catch (err) {
    next(err);
  }
};

export const createBackup = async (req, res, next) => {
  try {
    const backupDir = path.join(process.cwd(), 'uploads/backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = `backup-${timestamp}.json`;

    // Dump tables into JSON
    const members = await prisma.communityMember.findMany();
    const settings = await prisma.websiteSetting.findMany();
    const announcements = await prisma.announcement.findMany();

    const dataDump = { members, settings, announcements };
    fs.writeFileSync(path.join(backupDir, backupFile), JSON.stringify(dataDump, null, 2));

    // Log Activity
    await prisma.activityLog.create({
      data: {
        user_type: 'Admin',
        user_id: req.admin.id,
        action: 'Create Database Backup',
        module: 'Backups',
        ip_address: req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Database backup file generated successfully.',
      data: { file_name: backupFile }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Fetch and manage administrators list.
 */
export const getAdmins = async (req, res, next) => {
  try {
    const admins = await prisma.admin.findMany({
      orderBy: { created_at: 'desc' }
    });

    // Remove password hashes from outputs
    const safeAdmins = admins.map(({ password_hash, ...rest }) => rest);

    return res.status(200).json({
      success: true,
      message: 'Administrators list retrieved successfully.',
      data: safeAdmins
    });
  } catch (err) {
    next(err);
  }
};

export const createAdmin = async (req, res, next) => {
  try {
    const { full_name, email, password, role } = req.body;

    if (!email || !password || !full_name) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required.',
        errors: []
      });
    }

    const existing = await prisma.admin.findUnique({
      where: { email: email.trim().toLowerCase() }
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'An administrator account already exists with this email.',
        errors: []
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const admin = await prisma.admin.create({
      data: {
        full_name,
        email: email.trim().toLowerCase(),
        password_hash: passwordHash,
        role: role || 'Editor',
        status: 'Active'
      }
    });

    // Log Activity
    await prisma.activityLog.create({
      data: {
        user_type: 'Admin',
        user_id: req.admin.id,
        action: `Create Administrator: ${email}`,
        module: 'Administrators',
        ip_address: req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress
      }
    });

    const { password_hash, ...safeAdmin } = admin;
    return res.status(201).json({
      success: true,
      message: 'New administrator created successfully.',
      data: safeAdmin
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Review member registration (Approve/Reject).
 */
export const reviewMemberRegistration = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'Approved' or 'Rejected'

    const nextStatus = status === 'Approved' ? 'Active' : 'Rejected';

    let roleId = undefined;
    if (status === 'Approved') {
      const defaultRole = await prisma.role.findFirst({ where: { key: 'member' } });
      if (defaultRole) {
        roleId = defaultRole.id;
      }
    }

    const member = await prisma.communityMember.update({
      where: { id },
      data: {
        status: nextStatus,
        roleId: roleId || undefined
      }
    });

    // Log Activity
    await prisma.activityLog.create({
      data: {
        user_type: 'Admin',
        user_id: req.admin.id,
        action: `Review Member Registration: ${status} for ID ${member.member_id}`,
        module: 'Members',
        ip_address: req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress
      }
    });

    return res.status(200).json({
      success: true,
      message: `Member profile status updated to ${status}.`,
      data: member
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Fetch list of mentors and applications.
 */
export const getMentorsApplications = async (req, res, next) => {
  try {
    const mentors = await prisma.communityMember.findMany({
      where: {
        OR: [
          { is_mentor: true },
          { mentor_status: { in: ['Pending', 'Approved', 'Rejected'] } }
        ]
      },
      orderBy: { registration_date: 'desc' }
    });

    return res.status(200).json({
      success: true,
      message: 'Mentors list retrieved successfully.',
      data: mentors
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Review mentor application (Approve/Reject).
 */
export const reviewMentorApplication = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, specializations, notes } = req.body; // status: 'Approved' or 'Rejected'

    let roleId = undefined;
    if (status === 'Approved') {
      const defaultRole = await prisma.role.findFirst({ where: { key: 'mentor' } });
      if (defaultRole) {
        roleId = defaultRole.id;
      }
    }

    const member = await prisma.communityMember.update({
      where: { id },
      data: {
        mentor_status: status,
        is_mentor: status === 'Approved',
        mentor_specializations: specializations || undefined,
        roleId: roleId || undefined
      }
    });

    // Log Activity
    await prisma.activityLog.create({
      data: {
        user_type: 'Admin',
        user_id: req.admin.id,
        action: `Review Mentor Application: ${status} for ID ${member.member_id}`,
        module: 'Mentors',
        ip_address: req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress
      }
    });

    return res.status(200).json({
      success: true,
      message: `Mentor application status updated to ${status}.`,
      data: member
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Assign community role to a member.
 */
export const assignMemberRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { roleId } = req.body;

    const role = await prisma.role.findUnique({ where: { id: roleId } });
    if (!role) {
      return res.status(404).json({ success: false, message: 'Role not found' });
    }

    const member = await prisma.communityMember.update({
      where: { id },
      data: {
        roleId,
        is_volunteer: role.category === 'Leadership' || role.category === 'Department Leads' || role.key === 'volunteer' || role.key === 'senior-volunteer',
        volunteer_status: (role.category === 'Leadership' || role.category === 'Department Leads' || role.key === 'volunteer' || role.key === 'senior-volunteer') ? 'Approved' : undefined,
        volunteer_role: role.name,
        is_mentor: role.key === 'mentor',
        mentor_status: role.key === 'mentor' ? 'Approved' : undefined
      }
    });

    // Log Activity
    await prisma.activityLog.create({
      data: {
        user_type: 'Admin',
        user_id: req.admin.id,
        action: `Assign Member Role: ${role.name} for ID ${member.member_id}`,
        module: 'Members',
        ip_address: req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress
      }
    });

    return res.status(200).json({
      success: true,
      message: `Role assigned successfully: ${role.name}.`,
      data: member
    });
  } catch (err) {
    next(err);
  }
};

