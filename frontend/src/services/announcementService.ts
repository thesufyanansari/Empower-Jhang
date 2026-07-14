import { apiClient } from '../lib/apiClient';

export interface Announcement {
  id: string;
  title: string;
  description: string;
  priority: string;
  created_at: string;
}

export const announcementService = {
  /**
   * Fetch announcements.
   */
  async getAnnouncements(): Promise<any[]> {
    const { data } = await apiClient.get('/api/admin/announcements');
    return data.data;
  },

  /**
   * Publish a new community announcement.
   */
  async createAnnouncement(announcement: { title: string; description: string; priority?: string }): Promise<any> {
    const { data } = await apiClient.post('/api/admin/announcements', announcement);
    return data.data;
  },

  /**
   * Remove an announcement.
   */
  async deleteAnnouncement(id: string): Promise<{ message: string }> {
    const { data } = await apiClient.delete(`/api/admin/announcements/${id}`);
    return data;
  }
};
