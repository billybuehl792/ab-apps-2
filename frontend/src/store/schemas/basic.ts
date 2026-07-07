import z from "zod";
import { RegexPattern } from "../constants/regex";

export const idSchema = z.number().int().positive();

export const phoneSchema = z
  .string()
  .regex(RegexPattern.Phone, "Invalid phone number format");

export const idOrIdArraySchema = z
  .union([idSchema, z.array(idSchema)])
  .transform((val) => Array.from(new Set(Array.isArray(val) ? val : [val])));
