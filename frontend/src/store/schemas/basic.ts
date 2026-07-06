import z from "zod";
import { RegexPattern } from "../constants/regex";
import { userSchema } from "./account";

export const idSchema = z.string();

export const phoneSchema = z
  .string()
  .regex(RegexPattern.Phone, "Invalid phone number format");

export const idOrIdArraySchema = z
  .union([idSchema, z.array(idSchema)])
  .transform((val) => Array.from(new Set(Array.isArray(val) ? val : [val])));

export const historyEntrySchema = z.object({
  id: idSchema,
  user: userSchema.nullable(),
  action: z.enum(["Created", "Updated", "Deleted"]),
  history_date: z.iso.datetime(),
  changes: z.record(z.string(), z.tuple([z.unknown(), z.unknown()])),
});
