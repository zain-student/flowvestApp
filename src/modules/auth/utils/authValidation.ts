/**
 * Authentication Form Validation
 * Zod schemas for login and registration forms
 */

import { z } from "zod";

// Password validation schema
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[^a-zA-Z0-9]/,
    "Password must contain at least one special character"
  );

// Email validation schema
const emailSchema = z
  .string()
  .email("Please enter a valid email address")
  .min(1, "Email is required");

// Name validation schema
const nameSchema = z
  .string()
  .min(2, "Name must be at least 2 characters")
  .max(50, "Name must be less than 50 characters")
  .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces");

// Company name validation schema
const companyNameSchema = z
  .string()
  .min(2, "Company name must be at least 2 characters")
  .max(100, "Company name must be less than 100 characters");

// Invitation token validation schema
const invitationTokenSchema = z
  .string()
  .min(32, "Invitation token must be exactly 32 characters")
  .max(32, "Invitation token must be exactly 32 characters")
  .regex(/^[a-zA-Z0-9_-]+$/, "Invalid invitation token format");

// Login form validation schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
  remember: z.boolean().optional(),
});

// Base registration schema (common fields)
const baseRegistrationSchema = z.object({
  first_name: nameSchema,
  last_name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  password_confirmation: z.string(),
  role: z.enum(["admin", "user"], {
    required_error: "Please select a role",
  }),
  terms_accepted: z.boolean().refine((val: boolean) => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

// Admin registration schema
export const adminRegistrationSchema = baseRegistrationSchema
  .extend({
    role: z.literal("admin"),
    company_name: companyNameSchema,
  })
  .refine((data: any) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });

// User registration schema (invited)
export const invitedUserRegistrationSchema = baseRegistrationSchema
  .extend({
    role: z.literal("user"),
    registration_type: z.literal("invited"),
    invitation_token: invitationTokenSchema,
  })
  .refine((data: any) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });

// User registration schema (independent)
export const independentUserRegistrationSchema = baseRegistrationSchema
  .extend({
    role: z.literal("user"),
    registration_type: z.literal("independent"),
    company_name: companyNameSchema,
    company_type: z.enum(["individual", "private", "silent", "holding"], {
      required_error: "Please select a company type",
    }),
  })
  .refine((data: any) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });

// Dynamic registration schema based on role and registration type
export const createRegistrationSchema = (
  role: string,
  registrationType?: string
) => {
  if (role === "admin") {
    return adminRegistrationSchema;
  }

  if (role === "user") {
    if (registrationType === "invited") {
      return invitedUserRegistrationSchema;
    }
    if (registrationType === "independent") {
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
export const changePasswordSchema = z
  .object({
    current_password: z.string().min(1, "Current password is required"),
    password: passwordSchema,
    password_confirmation: z.string(),
  })
  .refine((data: any) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
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
    .min(2, "Partner name must be at least 2 characters")
    .max(50, "Partner name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Partner name can only contain letters and spaces"),
});

// Add and Edit Investment Schema

export const soloInvestmentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  type: z.literal("solo"), // ✅ use type
  // is_shared: z.literal(false),
  return_type: z.enum(["percentage", "fixed", "custom"]),
  frequency: z.enum(["monthly", "quarterly", "annual", "manual"]),
  status: z.enum(["draft", "active", "paused", "completed"]),
  start_date: z.string().min(1, "Start date required"),
  end_date: z.string().min(1, "End date required"),

  expected_return_rate: z.preprocess(
    (val) => (val !== "" && val !== undefined ? Number(val) : undefined),
    z.number().positive()
  ),

  initial_amount: z.preprocess(
    (val) => (val !== "" && val !== undefined ? Number(val) : undefined),
    z.number().positive()
  ),

  notes: z.string().optional(),
});

export const sharedInvestmentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  type: z.literal("shared"), // ✅ use type
  // is_shared: z.literal(true),
  return_type: z.enum(["percentage", "fixed", "custom"]),
  frequency: z.enum(["monthly", "quarterly", "annual", "manual"]),
  status: z.enum(["draft", "active", "paused", "completed"]),
  start_date: z.string().min(1, "Start date required"),
  end_date: z.string().min(1, "End date required"),

  expected_return_rate: z.preprocess(
    (val) => (val !== "" && val !== undefined ? Number(val) : undefined),
    z.number().positive()
  ),

  total_target_amount: z.preprocess(
    (val) => (val !== "" && val !== undefined ? Number(val) : undefined),
    z.number().positive()
  ),

  min_investment_amount: z.preprocess(
    (val) => (val !== "" && val !== undefined ? Number(val) : undefined),
    z.number().positive()
  ),

  max_investment_amount: z.preprocess(
    (val) => (val !== "" && val !== undefined ? Number(val) : undefined),
    z.number().positive()
  ),
});
// Add partner schema
export const addPartnerSchema = z
  .object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Enter a valid email"),
    phone: z
      .string()
      .regex(/^\d{10,15}$/, "Enter Phone number between 10–15 digits"),
    status: z.enum(["active", "inactive"]),
    company_name: z.string().min(2, "Company name is required"),
    company_type: z.enum(["individual", "private", "silent", "holding"]),
    address: z.string().min(5, "Address is required"),
    initial_investment: z.string().min(1, "Investment is required"),
    description: z.string().optional().or(z.literal("")),
    notes: z.string().optional().or(z.literal("")),
    send_email: z.boolean().optional(),
    generate_password: z.boolean().optional(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .optional(),
  })
  .refine(
    (data) => {
      // ✅ if generate_password = false → password is required
      if (data.generate_password === false && !data.password) {
        return false;
      }
      return true;
    },
    {
      message: "Password is required when auto-generate password is disabled",
      path: ["password"],
    }
  );
// Join Investment Schema
export const joinInvestmentSchema = z.object({
  amount: z.preprocess(
    (val) => (val !== "" && val !== undefined ? Number(val) : undefined),
    z.number().positive("Amount must be a positive number")
  ),
  notes: z.string().optional(),
});
// Type exports for form data
export type LoginFormData = z.infer<typeof loginSchema>;
export type AdminRegistrationFormData = z.infer<typeof adminRegistrationSchema>;
export type InvitedUserRegistrationFormData = z.infer<
  typeof invitedUserRegistrationSchema
>;
export type IndependentUserRegistrationFormData = z.infer<
  typeof independentUserRegistrationSchema
>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;
export type PartnerFormData = z.infer<typeof partnerSchema>;
export type AddPartnerFormData = z.infer<typeof addPartnerSchema>;
export type soloInvestmentSchema = z.infer<typeof soloInvestmentSchema>;
export type sharedInvestmentSchema = z.infer<typeof sharedInvestmentSchema>;
export type JoinInvestmentFormData = z.infer<typeof joinInvestmentSchema>;
// export type addPartnerSchema = z.infer<typeof addPartnerSchema>;

// Generic registration form data type
export type RegistrationFormData =
  | AdminRegistrationFormData
  | InvitedUserRegistrationFormData
  | IndependentUserRegistrationFormData;

// Helper function to validate form data
export const validateFormData = <T>(
  schema: z.ZodSchema<T>,
  data: unknown
): {
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
        const path = err.path.join(".");
        formattedErrors[path] = err.message;
      });
      return { success: false, errors: formattedErrors };
    }
    return { success: false, errors: { general: "Validation failed" } };
  }
};
