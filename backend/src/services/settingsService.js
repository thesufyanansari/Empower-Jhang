import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const settingsService = {
  /**
   * Retrieves global website settings. Creates default parameters if empty.
   */
  async getSettings() {
    let settings = await prisma.websiteSetting.findFirst();
    if (!settings) {
      settings = await prisma.websiteSetting.create({
        data: {
          site_name: 'Empower Jhang',
          tagline: 'Learn • Connect • Grow',
          contact_email: 'info@empowerjhang.org',
          contact_phone: '+92 300 1234567',
          address: 'Jhang, Punjab, Pakistan',
          footer_text: '© 2026 Empower Jhang. All rights reserved.'
        }
      });
    }
    return settings;
  },

  /**
   * Updates global settings parameters.
   */
  async updateSettings(data) {
    const existing = await prisma.websiteSetting.findFirst();
    if (existing) {
      return await prisma.websiteSetting.update({
        where: { id: existing.id },
        data: {
          site_name: data.website_name,
          tagline: data.tagline,
          contact_email: data.email,
          contact_phone: data.phone,
          address: data.address
        }
      });
    } else {
      return await prisma.websiteSetting.create({
        data: {
          site_name: data.website_name,
          tagline: data.tagline,
          contact_email: data.email,
          contact_phone: data.phone,
          address: data.address
        }
      });
    }
  },

  /**
   * Retrieves community links. Creates default parameters if empty.
   */
  async getLinks() {
    const rows = await prisma.communityLink.findMany({
      where: { status: 'Active' }
    });

    const linksObj = {
      facebook_group: '',
      whatsapp_community: '',
      whatsapp_channel: '',
      youtube: '',
      discord: '',
      telegram: '',
      instagram: '',
      website: ''
    };

    rows.forEach(r => {
      if (r.platform === 'Facebook') linksObj.facebook_group = r.url;
      else if (r.platform === 'WhatsApp' && r.title.includes('Community')) linksObj.whatsapp_community = r.url;
      else if (r.platform === 'WhatsApp' && r.title.includes('Channel')) linksObj.whatsapp_channel = r.url;
      else if (r.platform === 'YouTube') linksObj.youtube = r.url;
      else if (r.platform === 'Discord') linksObj.discord = r.url;
      else if (r.platform === 'Telegram') linksObj.telegram = r.url;
      else if (r.platform === 'Instagram') linksObj.instagram = r.url;
      else if (r.platform === 'Website') linksObj.website = r.url;
    });

    return linksObj;
  },

  /**
   * Updates community links parameters.
   */
  async updateLinks(data) {
    const upsertLink = async (platform, title, url) => {
      const existing = await prisma.communityLink.findFirst({
        where: { platform, title, status: 'Active' }
      });
      if (existing) {
        return await prisma.communityLink.update({
          where: { id: existing.id },
          data: { url: url || '' }
        });
      } else {
        return await prisma.communityLink.create({
          data: { platform, title, url: url || '' }
        });
      }
    };

    await upsertLink('Facebook', 'Facebook Group', data.facebook_group);
    await upsertLink('WhatsApp', 'WhatsApp Community Links', data.whatsapp_community);
    await upsertLink('WhatsApp', 'WhatsApp Channel Updates', data.whatsapp_channel);
    await upsertLink('YouTube', 'YouTube Channel link', data.youtube);
    await upsertLink('Discord', 'Official Discord Server', data.discord);
    await upsertLink('Telegram', 'Telegram Channel Updates', data.telegram);
    await upsertLink('Instagram', 'Official Instagram Profile', data.instagram);
    await upsertLink('Website', 'Official Website Address', data.website);

    return await this.getLinks();
  },

  /**
   * Retrieves announcements in descending order of creation.
   */
  async getAnnouncements() {
    return await prisma.announcement.findMany({
      where: { status: 'Published' },
      orderBy: { created_at: 'desc' }
    });
  },

  /**
   * Pushes a new announcement alert.
   */
  async createAnnouncement(data, creatorAdminId) {
    return await prisma.announcement.create({
      data: {
        title: data.title,
        description: data.description,
        priority: data.priority || 'Normal',
        created_by: creatorAdminId
      }
    });
  },

  /**
   * Soft deletes an announcement alert.
   */
  async deleteAnnouncement(id) {
    await prisma.announcement.update({
      where: { id },
      data: {
        status: 'Deleted',
        deleted_at: new Date()
      }
    });
    return { success: true };
  }
};
