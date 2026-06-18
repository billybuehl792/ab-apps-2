import { z } from "zod";
import { RegexPattern } from "@/store/constants/regex";

export const contactSchema = z.object({
  id: z.coerce.string(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.coerce.string().email("Invalid email address"),
  phone_primary: z.coerce
    .string()
    .regex(RegexPattern.Phone, "Invalid phone number format"),
  phone_secondary: z.coerce
    .string()
    .regex(RegexPattern.Phone, "Invalid phone number format")
    .optional(),
  google_place_id: z.string().optional(),
});

export const contactUpdateSchema = contactSchema.partial().extend({
  id: z.coerce.string(),
});

export const contactUploadFileSchema = z.object({
  id: z.coerce.string(),
  file: z.instanceof(File),
});
