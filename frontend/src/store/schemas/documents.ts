import z from "zod";
import { idSchema } from "./basic";
import { listRequestSchema, listResponseSchema } from "./api";

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

export const documentCreateSchema = z.object({
  label: z.string(),
  description: z.string().optional(),
  file: z.instanceof(File),
});

export const documentListRequestSchema = listRequestSchema;

export const documentListResponseSchema = listResponseSchema.extend({
  results: z.array(documentSchema),
});
