import z from "zod";
import { EUserGroup, EUserListOrdering } from "../enums/account";
import { listRequestSchema, listResponseSchema } from "./api";

const usernameSchema = z
  .string()
  .min(1, "Username is required")
  .max(64, "Username must be at most 64 characters");

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password must be at most 128 characters")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter");
// .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
// .regex(/[0-9]/, "Password must contain at least one number")
// .regex(
//   /[^A-Za-z0-9]/,
//   "Password must contain at least one special character",
// );

export const credentialsSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
});

export const userSchema = z.object({
  id: z.string(),
  username: usernameSchema,
  full_name: z.string().min(1, "Full name is required"),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.email("Invalid email address"),
  groups: z.array(z.enum(EUserGroup)),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime().nullable(),
});

export const userCreateRequestSchema = z.object({
  username: usernameSchema,
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.email("Invalid email address"),
  password: passwordSchema,
  groups: z.array(z.enum(EUserGroup)).optional(),
});

export const userUpdateRequestSchema = z.object({
  username: usernameSchema.optional(),
  first_name: z.string().min(1, "First name is required").optional(),
  last_name: z.string().min(1, "Last name is required").optional(),
  email: z.email("Invalid email address").optional(),
  groups: z.array(z.enum(EUserGroup)).optional(),
});

export const userListRequestSchema = listRequestSchema.extend({
  params: listRequestSchema.shape.params.extend({
    ordering: z.enum(EUserListOrdering).optional().catch(undefined),
  }),
});

export const userListResponseSchema = listResponseSchema.extend({
  results: z.array(userSchema),
});

/** Auth */

export const accessTokenResponseSchema = z.object({
  access: z.string(),
  me: userSchema,
});

export const requestPasswordResetRequestSchema = z.object({
  email: z.email("Invalid email address"),
});

export const resetPasswordRequestSchema = z
  .object({
    new_password: passwordSchema,
    new_password_confirm: passwordSchema,
  })
  .refine((data) => data.new_password === data.new_password_confirm, {
    message: "New passwords do not match",
    path: ["new_password_confirm"],
  });
