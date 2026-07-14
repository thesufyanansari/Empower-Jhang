import { apiClient } from '../lib/apiClient';

export interface Course {
  id: string;
  thumbnail?: string;
  title: string;
  description: string;
  category: string;
  instructor: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'All';
  youtube_video: string;
  notes?: string;
  downloads?: string;
  status: 'Active' | 'Draft';
  created_at: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: string;
  category: string;
  url?: string;
  download_path?: string;
  status: 'Active' | 'Draft';
  created_at: string;
}

export const learningService = {
  // ==========================================
  // COURSES
  // ==========================================
  
  /**
   * Fetch courses list publicly (with optional search/category filters).
   */
  async getCourses(params?: any): Promise<Course[]> {
    const { data } = await apiClient.get('/api/learning/courses', { params });
    return data.data;
  },

  /**
   * Fetch course by ID publicly.
   */
  async getCourseById(id: string): Promise<Course> {
    const { data } = await apiClient.get(`/api/learning/courses/${id}`);
    return data.data;
  },

  /**
   * Fetch courses list for Admin.
   */
  async getAdminCourses(): Promise<Course[]> {
    const { data } = await apiClient.get('/api/learning/admin/courses');
    return data.data;
  },

  /**
   * Create a new course (Admin).
   */
  async createCourse(payload: Partial<Course>): Promise<any> {
    const { data } = await apiClient.post('/api/learning/courses', payload);
    return data;
  },

  /**
   * Update course details (Admin).
   */
  async updateCourse(id: string, payload: Partial<Course>): Promise<any> {
    const { data } = await apiClient.put(`/api/learning/courses/${id}`, payload);
    return data;
  },

  /**
   * Delete course (Admin).
   */
  async deleteCourse(id: string): Promise<any> {
    const { data } = await apiClient.delete(`/api/learning/courses/${id}`);
    return data;
  },

  // ==========================================
  // RESOURCES
  // ==========================================

  /**
   * Fetch resources list publicly (with optional filters).
   */
  async getResources(params?: any): Promise<Resource[]> {
    const { data } = await apiClient.get('/api/learning/resources', { params });
    return data.data;
  },

  /**
   * Fetch resources list for Admin.
   */
  async getAdminResources(): Promise<Resource[]> {
    const { data } = await apiClient.get('/api/learning/admin/resources');
    return data.data;
  },

  /**
   * Create a new resource listing (Admin).
   */
  async createResource(payload: Partial<Resource>): Promise<any> {
    const { data } = await apiClient.post('/api/learning/resources', payload);
    return data;
  },

  /**
   * Update resource details (Admin).
   */
  async updateResource(id: string, payload: Partial<Resource>): Promise<any> {
    const { data } = await apiClient.put(`/api/learning/resources/${id}`, payload);
    return data;
  },

  /**
   * Delete resource (Admin).
   */
  async deleteResource(id: string): Promise<any> {
    const { data } = await apiClient.delete(`/api/learning/resources/${id}`);
    return data;
  }
};
