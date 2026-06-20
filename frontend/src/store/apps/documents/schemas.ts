import { z } from "zod";

export const documentSchema = z.object({
  id: z.coerce.string(),
  label: z.string(),
  description: z.string(),
  file: z.string(),
  thumbnail: z.string().nullable(),
  original_filename: z.string(),
  mime_type: z.string(),
  uploaded_by: z.coerce.string().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});
