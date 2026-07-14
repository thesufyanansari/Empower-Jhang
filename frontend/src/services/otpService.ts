import { apiClient } from '../lib/apiClient';

export interface VerifyOtpResponse {
  message: string;
  verified: boolean;
  is_admin: boolean;
  exists: boolean;
  id: string | null;
  member_id: string | null;
  email: string;
}

export const otpService = {
  /**
   * Request a 6-digit OTP code sent to the email.
   */
  async sendOtp(email: string): Promise<{ message: string }> {
    const { data } = await apiClient.post('/api/auth/send-otp', { email });
    return data;
  },

  /**
   * Resend a fresh 6-digit OTP code, invalidating previous keys.
   */
  async resendOtp(email: string): Promise<{ message: string }> {
    const { data } = await apiClient.post('/api/auth/resend-otp', { email });
    return data;
  },

  /**
   * Verify the 6-digit OTP code for standard users or admin sessions.
   */
  async verifyOtp(email: string, code: string): Promise<any> {
    const { data } = await apiClient.post('/api/auth/verify-otp', { email, code });
    return data.data;
  },

  /**
   * Logs out the active admin session.
   */
  async logout(): Promise<{ message: string }> {
    const { data } = await apiClient.post('/api/auth/logout');
    return data;
  },

  /**
   * Retrieve active admin login state.
   */
  async getSession(): Promise<any> {
    const { data } = await apiClient.get('/api/auth/session');
    return data.data;
  }
};
