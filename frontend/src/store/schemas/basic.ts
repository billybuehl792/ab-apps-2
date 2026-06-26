import z from "zod";
import { RegexPattern } from "../constants/regex";

export const phoneSchema = z
  .string()
  .regex(RegexPattern.Phone, "Invalid phone number format");

export const idOrIdArraySchema = z
  .union([z.string(), z.array(z.string())])
  .transform((val) => Array.from(new Set(Array.isArray(val) ? val : [val])));
