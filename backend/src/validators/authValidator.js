import { z } from 'zod';

export const sendOtpSchema = z.object({
  email: z.string({ required_error: 'Email is required' }).email('Invalid email address')
});

export const verifyOtpSchema = z.object({
  email: z.string({ required_error: 'Email is required' }).email('Invalid email address'),
  code: z.string({ required_error: 'OTP code is required' }).length(6, 'Verification code must be exactly 6 digits')
});

export const adminLoginSchema = z.object({
  email: z.string({ required_error: 'Email is required' }).email('Invalid email address'),
  password: z.string({ required_error: 'Password is required' }).min(6, 'Password must be at least 6 characters')
});
