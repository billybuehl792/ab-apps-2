import z from "zod";
import { listRequestSchema, listResponseSchema } from "./api";
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
