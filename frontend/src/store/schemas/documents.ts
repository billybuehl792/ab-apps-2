import z from "zod";
import { listRequestSchema, listResponseSchema } from "./api";

export const documentSchema = z.object({
  id: z.string(),
  label: z.string(),
  description: z.string(),
  file: z.string(),
  thumbnail: z.string().nullable(),
  original_filename: z.string(),
  mime_type: z.string(),
  uploaded_by: z.string().nullable(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
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
