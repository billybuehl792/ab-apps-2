import z from "zod";
import { listRequestSchema, listResponseSchema } from "./api";
import { idSchema } from "./basic";

export const jobSchema = z.object({
  id: idSchema,
  label: z.string().max(255),
  description: z.string().max(1024).nullable(),
  assignee: idSchema.nullable(),
  recipient: idSchema.nullable(),
  scheduled_at: z.string().datetime().nullable(),
  completed_at: z.string().datetime().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const jobCreateSchema = z.object({
  label: z.string().max(255).optional(),
  description: z.string().max(1024).nullable().optional(),
  assignee: idSchema.nullable().optional(),
  recipient: idSchema.nullable().optional(),
  scheduled_at: z.string().datetime().nullable().optional(),
  completed_at: z.string().datetime().nullable().optional(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

export const jobUpdateSchema = z.object({
  label: z.string().max(255).nullable().optional(),
  description: z.string().max(1024).nullable().optional(),
  assignee: idSchema.nullable().optional(),
  recipient: idSchema.nullable().optional(),
  scheduled_at: z.string().datetime().nullable().optional(),
  completed_at: z.string().datetime().nullable().optional(),
});

export const jobListRequestSchema = listRequestSchema;

export const jobListResponseSchema = listResponseSchema.extend({
  results: z.array(jobSchema),
});
