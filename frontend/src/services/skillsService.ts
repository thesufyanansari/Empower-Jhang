import { apiClient } from '../lib/apiClient';

export interface SkillItem {
  id: string;
  name: string;
  categoryId: string;
  display_order: number;
  status: 'Active' | 'Disabled';
}

export interface SkillCategory {
  id: string;
  name: string;
  display_order: number;
  status: 'Active' | 'Disabled';
  skills: SkillItem[];
}

export const skillsService = {
  /**
   * Fetch active categories and skills grouped publicly.
   */
  async getSkills(): Promise<SkillCategory[]> {
    const { data } = await apiClient.get('/api/skills');
    return data.data;
  },

  /**
   * Fetch all categories and skills including disabled ones for Admin.
   */
  async getAdminSkills(): Promise<SkillCategory[]> {
    const { data } = await apiClient.get('/api/skills/admin');
    return data.data;
  },

  /**
   * Create a new category (Admin).
   */
  async createCategory(payload: { name: string; display_order?: number }): Promise<any> {
    const { data } = await apiClient.post('/api/skills/category', payload);
    return data;
  },

  /**
   * Update category properties (Admin).
   */
  async updateCategory(id: string, payload: { name?: string; display_order?: number; status?: 'Active' | 'Disabled' }): Promise<any> {
    const { data } = await apiClient.put(`/api/skills/category/${id}`, payload);
    return data;
  },

  /**
   * Delete a category (Admin).
   */
  async deleteCategory(id: string): Promise<any> {
    const { data } = await apiClient.delete(`/api/skills/category/${id}`);
    return data;
  },

  /**
   * Create a new sub-skill (Admin).
   */
  async createSkill(payload: { name: string; categoryId: string; display_order?: number }): Promise<any> {
    const { data } = await apiClient.post('/api/skills/skill', payload);
    return data;
  },

  /**
   * Update sub-skill details (Admin).
   */
  async updateSkill(id: string, payload: { name?: string; categoryId?: string; display_order?: number; status?: 'Active' | 'Disabled' }): Promise<any> {
    const { data } = await apiClient.put(`/api/skills/skill/${id}`, payload);
    return data;
  },

  /**
   * Delete a sub-skill (Admin).
   */
  async deleteSkill(id: string): Promise<any> {
    const { data } = await apiClient.delete(`/api/skills/skill/${id}`);
    return data;
  }
};
