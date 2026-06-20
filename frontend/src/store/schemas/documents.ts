import z from "zod";
import { idSchema } from "./basic";

export const documentSchema = z.object({
  id: idSchema,
  label: z.string(),
  description: z.string(),
  file: z.string(),
  thumbnail: z.string().nullable(),
  original_filename: z.string(),
  mime_type: z.string(),
  uploaded_by: idSchema.nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});
