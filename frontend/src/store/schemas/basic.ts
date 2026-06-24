import z from "zod";
import { RegexPattern } from "../constants/regex";

export const idSchema = z.number().int().positive();

export const objectSchema = z.object({
  id: idSchema,
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime().nullable(),
});

export const nameSchema = z
  .string()
  .min(1, "Must be at least 1 character")
  .max(100, "Cannot exceed 100 characters")
  .trim();

export const phoneSchema = z
  .string()
  .regex(RegexPattern.Phone, "Invalid phone number format");

export const idOrIdArraySchema = z
  .union([idSchema, z.array(idSchema)])
  .transform((val) => Array.from(new Set(Array.isArray(val) ? val : [val])));
