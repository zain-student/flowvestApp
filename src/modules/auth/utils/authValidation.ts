/**
 * Authentication Form Validation
 * Zod schemas for login and registration forms
 */

import { z } from 'zod';

// Password validation schema
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character');

// Email validation schema
const emailSchema = z
  .string()
  .email('Please enter a valid email address')
  .min(1, 'Email is required');

// Name validation schema
const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name must be less than 50 characters')
  .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces');

// Company name validation schema
const companyNameSchema = z
  .string()
  .min(2, 'Company name must be at least 2 characters')
  .max(100, 'Company name must be less than 100 characters');

// Invitation token validation schema
const invitationTokenSchema = z
  .string()
  .min(32, 'Invitation token must be exactly 32 characters')
  .max(32, 'Invitation token must be exactly 32 characters')
  .regex(/^[a-zA-Z0-9_-]+$/, 'Invalid invitation token format');

// Login form validation schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
  remember: z.boolean().optional(),
});

// Base registration schema (common fields)
const baseRegistrationSchema = z.object({
  first_name: nameSchema,
  last_name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  password_confirmation: z.string(),
  role: z.enum(['admin', 'user'], {
    required_error: 'Please select a role',
  }),
  terms_accepted: z.boolean().refine((val: boolean) => val === true, {
    message: 'You must accept the terms and conditions',
  }),
});

// Admin registration schema
export const adminRegistrationSchema = baseRegistrationSchema.extend({
  role: z.literal('admin'),
  company_name: companyNameSchema,
}).refine((data: any) => data.password === data.password_confirmation, {
  message: 'Passwords do not match',
  path: ['password_confirmation'],
});

// User registration schema (invited)
export const invitedUserRegistrationSchema = baseRegistrationSchema.extend({
  role: z.literal('user'),
  registration_type: z.literal('invited'),
  invitation_token: invitationTokenSchema,
}).refine((data: any) => data.password === data.password_confirmation, {
  message: 'Passwords do not match',
  path: ['password_confirmation'],
});

// User registration schema (independent)
export const independentUserRegistrationSchema = baseRegistrationSchema.extend({
  role: z.literal('user'),
  registration_type: z.literal('independent'),
  company_name: companyNameSchema,
  company_type: z.enum(['individual', 'private', 'silent', 'holding'], {
    required_error: 'Please select a company type',
  }),
}).refine((data: any) => data.password === data.password_confirmation, {
  message: 'Passwords do not match',
  path: ['password_confirmation'],
});

// Dynamic registration schema based on role and registration type
export const createRegistrationSchema = (role: string, registrationType?: string) => {
  if (role === 'admin') {
    return adminRegistrationSchema;
  }
  
  if (role === 'user') {
    if (registrationType === 'invited') {
      return invitedUserRegistrationSchema;
    }
    if (registrationType === 'independent') {
      return independentUserRegistrationSchema;
    }
  }
  
  // Fallback to base schema
  return baseRegistrationSchema;
};

// Forgot password schema
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

// Change password schema
export const changePasswordSchema = z.object({
  current_password: z.string().min(1, 'Current password is required'),
  password: passwordSchema,
  password_confirmation: z.string(),
}).refine((data: any) => data.password === data.password_confirmation, {
  message: 'Passwords do not match',
  path: ['password_confirmation'],
});

// Profile update schema
export const profileUpdateSchema = z.object({
  first_name: nameSchema,
  last_name: nameSchema,
  email: emailSchema,
});
// Partner form validation schema
export const partnerSchema = z.object({
  name: z
    .string()
    .min(2, 'Partner name must be at least 2 characters')
    .max(50, 'Partner name must be less than 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Partner name can only contain letters and spaces'),
});
export const addPartnerSchema = z.object({
  first_name: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters'),

  last_name: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters'),

  email: z
    .string()
    .email('Enter a valid email'),

  phone: z
    .string()
    .min(7, 'Phone number must be at least 7 characters')
    .max(15, 'Phone number must be less than 15 characters')
    .optional(),

  role: z.string().min(1, 'Role is required'),

  permissions: z
    .string()
    .min(1, 'Permissions are required'),

  send_invitation: z.enum(['Yes', 'No']),
});

// Type exports for form data
export type LoginFormData = z.infer<typeof loginSchema>;
export type AdminRegistrationFormData = z.infer<typeof adminRegistrationSchema>;
export type InvitedUserRegistrationFormData = z.infer<typeof invitedUserRegistrationSchema>;
export type IndependentUserRegistrationFormData = z.infer<typeof independentUserRegistrationSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;
export type PartnerFormData = z.infer<typeof partnerSchema>;
export type AddPartnerFormData = z.infer<typeof addPartnerSchema>;

// Generic registration form data type
export type RegistrationFormData = 
  | AdminRegistrationFormData 
  | InvitedUserRegistrationFormData 
  | IndependentUserRegistrationFormData;

// Helper function to validate form data
export const validateFormData = <T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  errors?: Record<string, string>;
} => {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors: Record<string, string> = {};
      error.errors.forEach((err: any) => {
        const path = err.path.join('.');
        formattedErrors[path] = err.message;
      });
      return { success: false, errors: formattedErrors };
    }
    return { success: false, errors: { general: 'Validation failed' } };
  }
}; 