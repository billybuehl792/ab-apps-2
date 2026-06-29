import z from "zod";
import { RegexPattern } from "../constants/regex";
import { userSchema } from "./account";

export const phoneSchema = z
  .string()
  .regex(RegexPattern.Phone, "Invalid phone number format");

export const idOrIdArraySchema = z
  .union([z.string(), z.array(z.string())])
  .transform((val) => Array.from(new Set(Array.isArray(val) ? val : [val])));

export const historyEntrySchema = z.object({
  id: z.coerce.string(),
  user: userSchema.nullable(),
  action: z.enum(["Created", "Updated", "Deleted"]),
  history_date: z.iso.datetime(),
  changes: z.record(z.string(), z.tuple([z.unknown(), z.unknown()])),
});
