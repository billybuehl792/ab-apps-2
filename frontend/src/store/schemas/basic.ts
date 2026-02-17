import z from "zod";
import { NULL_ID } from "../constants/api";

export const idSchema = z.coerce.number().int().positive().catch(NULL_ID);

export const nameSchema = z.coerce.string().min(1).max(100).trim().catch("");

export const emailSchema = z.coerce.string().email().catch("");

export const phoneSchema = z.coerce
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format")
  .catch("");

export const truthySchema = z.coerce
  .boolean()
  .optional()
  .transform((val) => !!val || undefined)
  .catch(undefined);

export const idOrIdArraySchema = z
  .union([idSchema, z.array(idSchema)])
  .transform((val) => Array.from(new Set(Array.isArray(val) ? val : [val])))
  .transform((val) => val.filter((id) => id !== NULL_ID))
  .pipe(z.array(idSchema).min(1))
  .catch([]);
