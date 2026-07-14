import { apiClient } from '../lib/apiClient';

export interface WebsiteSettings {
  website_name: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
}

export interface CommunityLinks {
  facebook_group: string;
  whatsapp_community: string;
  whatsapp_channel: string;
  youtube: string;
  discord: string;
  telegram: string;
}

export interface AdminStatistics {
  totalMembers: number;
  verifiedMembers: number;
  pendingVerifications: number;
  announcementsCount: number;
  recentMembers: any[];
}

export const settingsService = {
  /**
   * Fetch settings publicly.
   */
  async getPublicSettings(): Promise<any> {
    const { data } = await apiClient.get('/api/member/public/settings');
    return data.data;
  },

  /**
   * Fetch community social channels publicly.
   */
  async getPublicLinks(): Promise<any> {
    const { data } = await apiClient.get('/api/member/public/links');
    return data.data;
  },

  /**
   * Fetch system settings (Admin).
   */
  async getSettings(): Promise<any> {
    const { data } = await apiClient.get('/api/admin/settings');
    return data.data;
  },

  /**
   * Update global settings (Admin).
   */
  async updateSettings(settings: WebsiteSettings): Promise<any> {
    const { data } = await apiClient.post('/api/admin/settings', settings);
    return data.data;
  },

  /**
   * Fetch community group links (Admin).
   */
  async getLinks(): Promise<any> {
    const { data } = await apiClient.get('/api/admin/links');
    return data.data;
  },

  /**
   * Update community group links (Admin).
   */
  async updateLinks(links: CommunityLinks): Promise<any> {
    const { data } = await apiClient.post('/api/admin/links', links);
    return data.data;
  },

  /**
   * Retrieve Admin Dashboard overview statistics.
   */
  async getStatistics(): Promise<any> {
    const { data } = await apiClient.get('/api/admin/statistics');
    return data.data;
  },

  /**
   * Fetch volunteers list (Admin).
   */
  async getVolunteers(): Promise<any[]> {
    const { data } = await apiClient.get('/api/admin/volunteers');
    return data.data;
  },

  /**
   * Review volunteer application (Admin).
   */
  async reviewVolunteer(id: string, status: string, notes?: string): Promise<any> {
    const { data } = await apiClient.put(`/api/admin/volunteers/${id}/review`, { status, notes });
    return data.data;
  },

  /**
   * Assign volunteer role & department (Admin).
   */
  async assignVolunteer(id: string, department: string, role: string): Promise<any> {
    const { data } = await apiClient.put(`/api/admin/volunteers/${id}/assign`, { department, role });
    return data.data;
  },

  /**
   * Fetch audit logs (Admin).
   */
  async getActivityLogs(): Promise<any[]> {
    const { data } = await apiClient.get('/api/admin/activity-logs');
    return data.data;
  },

  /**
   * Fetch system health stats (Admin).
   */
  async getSystemHealth(): Promise<any> {
    const { data } = await apiClient.get('/api/admin/system-health');
    return data.data;
  },

  /**
   * Fetch backup files history (Admin).
   */
  async getBackups(): Promise<any[]> {
    const { data } = await apiClient.get('/api/admin/backups');
    return data.data;
  },

  /**
   * Create database backup dump (Admin).
   */
  async createBackup(): Promise<any> {
    const { data } = await apiClient.post('/api/admin/backups');
    return data.data;
  },

  /**
   * Fetch admin users list (Admin).
   */
  async getAdmins(): Promise<any[]> {
    const { data } = await apiClient.get('/api/admin/admins');
    return data.data;
  },

  /**
   * Create new admin user profile (Admin).
   */
  async createAdmin(adminData: any): Promise<any> {
    const { data } = await apiClient.post('/api/admin/admins', adminData);
    return data.data;
  }
};
