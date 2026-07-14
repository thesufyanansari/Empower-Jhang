import { z } from 'zod';

export const registerMemberSchema = z.object({
  email: z.string({ required_error: 'Email is required' }).email('Invalid email address'),
  full_name: z.string({ required_error: 'Full Name is required' }).min(2, 'Name must be at least 2 characters'),
  father_name: z.string({ required_error: 'Father Name is required' }).min(2, 'Father name must be at least 2 characters'),
  gender: z.enum(['Male', 'Female', 'Other'], { required_error: 'Gender is required' }),
  date_of_birth: z.string({ required_error: 'Date of birth is required' }),
  whatsapp: z.string({ required_error: 'WhatsApp number is required' }).min(10, 'WhatsApp number is too short'),
  district: z.string({ required_error: 'District is required' }),
  address: z.string({ required_error: 'Address is required' }).min(5, 'Address is too short'),
  education: z.string({ required_error: 'Education is required' }),
  occupation: z.string({ required_error: 'Occupation is required' }),
  bio: z.string().max(500, 'Bio cannot exceed 500 characters').optional().default(''),
  skills: z.string().optional().default(''),
  interests: z.string().optional().default(''),
  facebook: z.string().url('Invalid URL format').or(z.literal('')).optional().default(''),
  instagram: z.string().url('Invalid URL format').or(z.literal('')).optional().default(''),
  linkedin: z.string().url('Invalid URL format').or(z.literal('')).optional().default(''),
  github: z.string().url('Invalid URL format').or(z.literal('')).optional().default(''),
  portfolio: z.string().url('Invalid URL format').or(z.literal('')).optional().default('')
});

export const updateProfileSchema = z.object({
  occupation: z.string().optional(),
  education: z.string().optional(),
  bio: z.string().max(500).optional(),
  whatsapp: z.string().min(10).optional(),
  address: z.string().min(5).optional(),
  skills: z.string().optional(),
  interests: z.string().optional(),
  facebook: z.string().url().or(z.literal('')).optional(),
  instagram: z.string().url().or(z.literal('')).optional(),
  linkedin: z.string().url().or(z.literal('')).optional(),
  github: z.string().url().or(z.literal('')).optional(),
  portfolio: z.string().url().or(z.literal('')).optional()
});
