import z from "zod";
import {
  emailSchema,
  idOrIdArraySchema,
  nameSchema,
  objectSchema,
} from "./basic";
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

export const companySchema = objectSchema.extend({
  label: z.coerce.string().min(1).max(100),
  description: emailSchema,
});

export const userSchema = objectSchema.extend({
  username: usernameSchema,
  full_name: nameSchema,
  first_name: nameSchema,
  last_name: nameSchema,
  email: emailSchema,
  groups: z.array(z.nativeEnum(EUserGroup)),
  company: companySchema,
});

export const userCreateSchema = z.object({
  username: usernameSchema,
  first_name: nameSchema,
  last_name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  groups: z.array(z.nativeEnum(EUserGroup)).optional(),
  company: companySchema.optional(),
});

export const userUpdateSchema = z.object({
  username: usernameSchema.optional(),
  first_name: nameSchema.optional(),
  last_name: nameSchema.optional(),
  email: emailSchema.optional(),
  groups: z.array(z.nativeEnum(EUserGroup)).optional(),
  company: companySchema.optional(),
});

export const userListRequestSchema = listRequestSchema.extend({
  params: listRequestSchema.shape.params.extend({
    ordering: z
      .nativeEnum(EUserListOrdering)
      .optional()
      .transform((val) => val || EUserListOrdering.FirstNameAsc)
      .catch(EUserListOrdering.FirstNameAsc),
    company: idOrIdArraySchema.optional(),
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
  email: emailSchema,
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
