import { PrismaClient } from '@prisma/client';
import { sendWelcomeEmail, sendAdminNotification } from './emailService.js';

const prisma = new PrismaClient();

const POSITION_ORDER = [
  'Founder',
  'Co-Founder',
  'President',
  'Vice President',
  'General Secretary',
  'Joint Secretary',
  'Treasurer',
  'Community Director',
  'Program Director',
  'Operations Manager',
  'Volunteer Coordinator',
  'Media Manager',
  'Creative Lead',
  'Marketing Lead',
  'Technical Lead',
  'Community Ambassador',
  'Senior Volunteer',
  'Volunteer'
];

const mapMember = (m) => {
  if (!m) return null;
  return {
    ...m,
    is_active: m.status === 'Active',
    is_verified: m.email_verified
  };
};

export const memberService = {
  /**
   * Registers a new community member.
   */
  async registerMember(data, file) {
    const cleanEmail = data.email.toLowerCase().trim();

    // Check duplicate email
    const emailExists = await prisma.communityMember.findFirst({
      where: { email: cleanEmail, status: { not: 'Deleted' } }
    });
    if (emailExists) {
      throw new Error('This email address is already registered.');
    }

    // Check duplicate whatsapp
    const whatsappExists = await prisma.communityMember.findFirst({
      where: { whatsapp: data.whatsapp, status: { not: 'Deleted' } }
    });
    if (whatsappExists) {
      throw new Error('This WhatsApp number is already registered.');
    }

    // Generate unique sequential member ID in a transaction
    const newMemberId = await prisma.$transaction(async (tx) => {
      const counter = await tx.memberCounter.create({ data: {} });
      const formattedNum = counter.id.toString().padStart(6, '0');
      return `EMP-${formattedNum}`;
    });

    // Profile photo location
    let profilePhotoUrl = null;
    if (file) {
      profilePhotoUrl = `/uploads/profile/${file.filename}`;
    }

    const defaultBio = data.bio || `${data.occupation} based in ${data.district}. Open to connections and learning.`;

    // Create community member profile
    const newMember = await prisma.communityMember.create({
      data: {
        member_id: newMemberId,
        full_name: data.full_name,
        father_name: data.father_name,
        gender: data.gender,
        date_of_birth: data.date_of_birth,
        whatsapp: data.whatsapp,
        email: cleanEmail,
        district: data.district, // Maps directly to Jhang, Shorkot, etc. enum
        education: data.education,
        profession: data.occupation, // Map to model's profession attribute
        profile_photo: profilePhotoUrl,
        bio: defaultBio,
        skills: data.skills || '',
        interests: data.interests || '',
        facebook: data.facebook || '',
        instagram: data.instagram || '',
        linkedin: data.linkedin || '',
        github: data.github || '',
        portfolio: data.portfolio || '',
        behance: data.behance || '',
        dribbble: data.dribbble || '',
        youtube: data.youtube || '',
        website: data.website || '',
        status: 'Pending', // New registration is pending admin approval
        volunteer_status: 'None',
        mentor_status: 'None'
      }
    });

    // Create member card record mapping
    await prisma.memberCard.create({
      data: {
        member_id: newMember.id,
        card_number: newMemberId,
        pdf_path: `/api/member/${newMemberId}/card/pdf`,
        png_path: `/api/member/${newMemberId}/card/qr`
      }
    });

    // Log Activity Log
    await prisma.activityLog.create({
      data: {
        user_type: 'Member',
        user_id: newMember.id,
        action: 'Member Registration',
        module: 'Registration',
        ip_address: data.ip_address || null,
        device: data.device || null,
        browser: data.browser || null
      }
    });

    // Dispatch asynchronous welcome and admin notification emails
    sendWelcomeEmail(cleanEmail, newMember.full_name, newMemberId).catch(err => {
      console.error('Welcome email dispatch failed:', err);
    });
    sendAdminNotification(newMember.full_name, newMemberId, newMember.district).catch(err => {
      console.error('Admin notification dispatch failed:', err);
    });

    return mapMember(newMember);
  },

  /**
   * Fetches community member profile by sequential member ID.
   */
  async getProfile(memberId) {
    const user = await prisma.communityMember.findFirst({
      where: { member_id: memberId, status: { not: 'Deleted' } },
      include: {
        role: {
          include: {
            badge: true,
            theme: true,
            card: true
          }
        }
      }
    });
    if (!user) {
      throw new Error('Member profile not found.');
    }
    return mapMember(user);
  },

  /**
   * Updates profile values.
   */
  async updateProfile(memberId, updates) {
    const user = await prisma.communityMember.findFirst({
      where: { member_id: memberId, status: { not: 'Deleted' } }
    });
    if (!user) {
      throw new Error('Member profile not found.');
    }

    const updatedUser = await prisma.communityMember.update({
      where: { member_id: memberId },
      data: {
        profession: updates.occupation,
        education: updates.education,
        bio: updates.bio,
        whatsapp: updates.whatsapp,
        address: updates.address,
        skills: updates.skills,
        interests: updates.interests,
        facebook: updates.facebook,
        instagram: updates.instagram,
        linkedin: updates.linkedin,
        github: updates.github,
        portfolio: updates.portfolio,
        behance: updates.behance,
        dribbble: updates.dribbble,
        youtube: updates.youtube,
        website: updates.website
      }
    });

    return mapMember(updatedUser);
  },

  /**
   * Submit Volunteer detailed application details.
   */
  async applyVolunteer(memberId, data) {
    const user = await prisma.communityMember.findFirst({
      where: { member_id: memberId, status: { not: 'Deleted' } }
    });
    if (!user) {
      throw new Error('Member profile not found.');
    }

    const updated = await prisma.communityMember.update({
      where: { member_id: memberId },
      data: {
        volunteer_status: 'Pending',
        volunteer_experience: data.experience,
        volunteer_availability: data.availability,
        volunteer_motivation: data.motivation,
        volunteer_leadership: data.leadership,
        volunteer_emergency_contact: data.emergency_contact,
        volunteer_interests: data.interests,
        volunteer_previous_work: data.previous_work,
        volunteer_time_weekly: data.time_weekly,
        volunteer_value_bring: data.value_bring,
        volunteer_references: data.references,
        
        // Optional links
        facebook: data.facebook || user.facebook,
        linkedin: data.linkedin || user.linkedin,
        website: data.website || user.website,
        portfolio: data.portfolio || user.portfolio,
        github: data.github || user.github,
        behance: data.behance || user.behance,
        dribbble: data.dribbble || user.dribbble,
        instagram: data.instagram || user.instagram,
        youtube: data.youtube || user.youtube
      }
    });

    return mapMember(updated);
  },

  /**
   * Submit Mentor detailed application details.
   */
  async applyMentor(memberId, data) {
    const user = await prisma.communityMember.findFirst({
      where: { member_id: memberId, status: { not: 'Deleted' } }
    });
    if (!user) {
      throw new Error('Member profile not found.');
    }

    const updated = await prisma.communityMember.update({
      where: { member_id: memberId },
      data: {
        mentor_status: 'Pending',
        mentor_experience_years: data.experience_years,
        mentor_industry: data.industry,
        mentor_teaching_exp: data.teaching_exp,
        mentor_mentoring_exp: data.mentoring_exp,
        mentor_specializations: data.specializations,
        mentor_availability: data.availability,
        mentor_languages: data.languages,
        mentor_achievements: data.achievements,
        mentor_certifications: data.certifications,
        mentor_motivation: data.motivation,
        mentor_style: data.style,

        // Optional links
        facebook: data.facebook || user.facebook,
        linkedin: data.linkedin || user.linkedin,
        website: data.website || user.website,
        portfolio: data.portfolio || user.portfolio,
        github: data.github || user.github,
        behance: data.behance || user.behance,
        dribbble: data.dribbble || user.dribbble,
        instagram: data.instagram || user.instagram,
        youtube: data.youtube || user.youtube
      }
    });

    return mapMember(updated);
  },

  /**
   * Fetches counts of members, volunteers, mentors, courses, and resources.
   */
  async getMemberCount() {
    const approvedMembers = await prisma.communityMember.count({
      where: { status: 'Active' }
    });
    const approvedVolunteers = await prisma.communityMember.count({
      where: { is_volunteer: true, volunteer_status: 'Approved', status: 'Active' }
    });
    const approvedMentors = await prisma.communityMember.count({
      where: { is_mentor: true, mentor_status: 'Approved', status: 'Active' }
    });
    const coursesCount = await prisma.course.count({
      where: { status: 'Active' }
    });
    const resourcesCount = await prisma.resource.count({
      where: { status: 'Active' }
    });

    return {
      count: approvedMembers, // Backward compatibility
      approvedMembers,
      approvedVolunteers,
      approvedMentors,
      coursesCount,
      resourcesCount
    };
  },

  /**
   * Get all approved members for public directory (Searchable, filterable).
   */
  async getPublicMembers(filters = {}) {
    const where = { status: 'Active' };
    
    if (filters.district && filters.district !== 'All') {
      where.district = filters.district;
    }

    if (filters.search) {
      const term = filters.search.toLowerCase();
      where.OR = [
        { full_name: { contains: term } },
        { profession: { contains: term } },
        { bio: { contains: term } }
      ];
    }

    if (filters.role && filters.role !== 'All') {
      where.role = {
        name: filters.role
      };
    }

    let members = await prisma.communityMember.findMany({
      where,
      include: {
        role: {
          include: {
            badge: true,
            theme: true,
            card: true
          }
        }
      },
      orderBy: { registration_date: 'desc' }
    });

    // Client-side skill filter check since skill tags are comma separated text in database
    if (filters.skill && filters.skill !== 'All') {
      members = members.filter(m => 
        m.skills?.toLowerCase().split(',').map(s => s.trim()).includes(filters.skill.toLowerCase())
      );
    }

    return members.map(mapMember);
  },

  /**
   * Fetch approved volunteers, sorted by role display_order priority.
   */
  async getPublicVolunteers() {
    const volunteers = await prisma.communityMember.findMany({
      where: {
        status: 'Active',
        role: {
          key: { in: ['volunteer', 'senior-volunteer', 'community-ambassador'] }
        }
      },
      include: {
        role: {
          include: {
            badge: true,
            theme: true,
            card: true
          }
        }
      }
    });

    return volunteers.map(mapMember).sort((a, b) => {
      const orderA = a.role?.display_order ?? 999;
      const orderB = b.role?.display_order ?? 999;
      return orderA - orderB;
    });
  },

  /**
   * Fetch approved mentors.
   */
  async getPublicMentors() {
    const mentors = await prisma.communityMember.findMany({
      where: {
        status: 'Active',
        role: {
          key: 'mentor'
        }
      },
      include: {
        role: {
          include: {
            badge: true,
            theme: true,
            card: true
          }
        }
      }
    });
    return mentors.map(mapMember);
  },

  /**
   * Fetch approved leadership team profiles sorted by hierarchy display order.
   */
  async getPublicLeadership() {
    const leadership = await prisma.communityMember.findMany({
      where: {
        status: 'Active',
        role: {
          category: { in: ['Leadership', 'Department Leads'] }
        }
      },
      include: {
        role: {
          include: {
            badge: true,
            theme: true,
            card: true
          }
        }
      }
    });

    return leadership.map(mapMember).sort((a, b) => {
      const orderA = a.role?.display_order ?? 999;
      const orderB = b.role?.display_order ?? 999;
      return orderA - orderB;
    });
  },

  /**
   * Fetches all members (Admin only).
   */
  async getAdminMembers(filters = {}) {
    const where = { status: { not: 'Deleted' } };
    if (filters.is_verified !== undefined) {
      where.email_verified = filters.is_verified;
    }
    if (filters.is_active !== undefined) {
      where.status = filters.is_active ? 'Active' : 'Suspended';
    }
    if (filters.status) {
      where.status = filters.status;
    }
    const members = await prisma.communityMember.findMany({
      where,
      include: {
        role: {
          include: {
            badge: true,
            theme: true,
            card: true
          }
        }
      },
      orderBy: { registration_date: 'desc' }
    });
    return members.map(mapMember);
  },

  /**
   * Toggles verification status.
   */
  async toggleVerifyMember(id) {
    const user = await prisma.communityMember.findUnique({ where: { id } });
    if (!user) {
      throw new Error('User not found.');
    }
    const updated = await prisma.communityMember.update({
      where: { id },
      data: { email_verified: !user.email_verified }
    });
    return mapMember(updated);
  },

  /**
   * Toggles active / suspended status.
   */
  async toggleSuspendMember(id) {
    const user = await prisma.communityMember.findUnique({ where: { id } });
    if (!user) {
      throw new Error('User not found.');
    }
    const nextStatus = user.status === 'Active' ? 'Suspended' : 'Active';
    const updated = await prisma.communityMember.update({
      where: { id },
      data: { status: nextStatus }
    });
    return mapMember(updated);
  },

  /**
   * Soft deletes a user profile.
   */
  async deleteMember(id) {
    const user = await prisma.communityMember.findUnique({ where: { id } });
    if (!user) {
      throw new Error('User not found.');
    }
    await prisma.communityMember.update({
      where: { id },
      data: { status: 'Deleted', deleted_at: new Date() }
    });
    return { success: true };
  },

  /**
   * Calculates dashboard analytics and overview parameters (Admin).
   */
  async getAdminStatistics() {
    const totalMembers = await prisma.communityMember.count({ where: { status: { not: 'Deleted' } } });
    const verifiedMembers = await prisma.communityMember.count({ where: { email_verified: true, status: { not: 'Deleted' } } });
    const pendingVerifications = await prisma.communityMember.count({ where: { status: 'Pending' } });
    const announcementsCount = await prisma.announcement.count({ where: { status: { not: 'Deleted' } } });

    const recentMembers = await prisma.communityMember.findMany({
      where: { status: { not: 'Deleted' } },
      take: 5,
      orderBy: { registration_date: 'desc' },
      select: {
        id: true,
        member_id: true,
        full_name: true,
        email: true,
        whatsapp: true,
        registration_date: true,
        email_verified: true,
        status: true
      }
    });

    return {
      totalMembers,
      verifiedMembers,
      pendingVerifications,
      announcementsCount,
      recentMembers: recentMembers.map(m => ({
        ...m,
        is_active: m.status === 'Active',
        is_verified: m.email_verified
      }))
    };
  }
};
