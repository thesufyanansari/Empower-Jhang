import { apiClient } from '../lib/apiClient';

export const memberService = {
  /**
   * Register a new member using form-data (with profile photo file).
   */
  async registerMember(formData: FormData): Promise<any> {
    const { data } = await apiClient.post('/api/member/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data.data;
  },

  /**
   * Retrieve member profile by sequential member ID.
   */
  async getProfile(memberId: string): Promise<any> {
    const { data } = await apiClient.get(`/api/member/${memberId}`);
    return data.data;
  },

  /**
   * Update member profile parameters.
   */
  async updateProfile(memberId: string, updates: any, secretId?: string): Promise<any> {
    const headers = secretId ? { 'x-profile-id': secretId } : {};
    const { data } = await apiClient.put(`/api/member/${memberId}`, updates, { headers });
    return data.data;
  },

  /**
   * Retrieve total count of registered members and other directory statistics.
   */
  async getMemberCount(): Promise<{
    count: number;
    approvedMembers: number;
    approvedVolunteers: number;
    approvedMentors: number;
    coursesCount: number;
    resourcesCount: number;
  }> {
    const { data } = await apiClient.get('/api/member/public/count');
    return data;
  },

  /**
   * Fetch all members inside admin panel (filterable).
   */
  async getAdminMembers(params?: any): Promise<any[]> {
    const { data } = await apiClient.get('/api/admin/members', { params });
    return data.data;
  },

  /**
   * Toggle verification status for member.
   */
  async toggleVerifyMember(id: string): Promise<{ message: string; member: any }> {
    const { data } = await apiClient.put(`/api/admin/members/${id}/verify`);
    return data;
  },

  /**
   * Toggle suspended active status for member.
   */
  async toggleSuspendMember(id: string): Promise<{ message: string; member: any }> {
    const { data } = await apiClient.put(`/api/admin/members/${id}/suspend`);
    return data;
  },

  /**
   * Irreversibly delete a member profile.
   */
  async deleteMember(id: string): Promise<{ message: string }> {
    const { data } = await apiClient.delete(`/api/admin/members/${id}`);
    return data;
  },

  /**
   * Approve a member registration profile.
   */
  async approveMember(id: string, status: 'Approved' | 'Rejected'): Promise<any> {
    const { data } = await apiClient.put(`/api/admin/members/${id}/approve`, { status });
    return data;
  },

  /**
   * Fetch approved members for public directory.
   */
  async getPublicDirectory(params?: any): Promise<any[]> {
    const { data } = await apiClient.get('/api/member/public/directory', { params });
    return data.data;
  },

  /**
   * Fetch approved volunteers for team page.
   */
  async getPublicVolunteers(): Promise<any[]> {
    const { data } = await apiClient.get('/api/member/public/volunteers');
    return data.data;
  },

  /**
   * Fetch approved mentors for team page.
   */
  async getPublicMentors(): Promise<any[]> {
    const { data } = await apiClient.get('/api/member/public/mentors');
    return data.data;
  },

  /**
   * Submit volunteer application questionnaire.
   */
  async applyVolunteer(memberId: string, payload: any): Promise<any> {
    const { data } = await apiClient.post(`/api/member/${memberId}/volunteer`, payload);
    return data;
  },

  /**
   * Submit mentor application questionnaire.
   */
  async applyMentor(memberId: string, payload: any): Promise<any> {
    const { data } = await apiClient.post(`/api/member/${memberId}/mentor`, payload);
    return data;
  },

  /**
   * Get all mentor applications (Admin).
   */
  async getAdminMentors(): Promise<any[]> {
    const { data } = await apiClient.get('/api/admin/mentors');
    return data.data;
  },

  /**
   * Review mentor application status (Admin).
   */
  async reviewMentor(id: string, status: 'Approved' | 'Rejected', specializations?: string, notes?: string): Promise<any> {
    const { data } = await apiClient.put(`/api/admin/mentors/${id}/review`, { status, specializations, notes });
    return data;
  },

  /**
   * Fetch approved leadership team members.
   */
  async getPublicLeadership(): Promise<any[]> {
    const { data } = await apiClient.get('/api/member/public/leadership');
    return data.data;
  },

  /**
   * Fetch all roles.
   */
  async getRoles(): Promise<any[]> {
    const { data } = await apiClient.get('/api/roles');
    return data.data;
  },

  /**
   * Assign a role to a community member.
   */
  async assignRole(id: string, roleId: string): Promise<any> {
    const { data } = await apiClient.put(`/api/admin/members/${id}/role`, { roleId });
    return data;
  },

  /**
   * Create custom role (Admin).
   */
  async createRole(roleData: any): Promise<any> {
    const { data } = await apiClient.post('/api/roles', roleData);
    return data;
  },

  /**
   * Update role details (Admin).
   */
  async updateRole(id: string, roleData: any): Promise<any> {
    const { data } = await apiClient.put(`/api/roles/${id}`, roleData);
    return data;
  },

  /**
   * Delete role (Admin).
   */
  async deleteRole(id: string): Promise<any> {
    const { data } = await apiClient.delete(`/api/roles/${id}`);
    return data;
  },

  /**
   * Reorder roles display priority (Admin).
   */
  async reorderRoles(orders: { id: string; display_order: number }[]): Promise<any> {
    const { data } = await apiClient.put('/api/roles/reorder', { orders });
    return data;
  }
};
