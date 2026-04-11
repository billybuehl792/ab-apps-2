import z from "zod";
import { listRequestSchema, listResponseSchema } from "./api";
import { idSchema } from "./basic";
import { googleAutocompleteSuggestionSchema, placeBasicSchema } from "./places";
import { EJobListOrdering } from "../enums/jobs";

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
  label: z.string().max(255).default(""),
  description: z.string().default(""),
  representative: idSchema.nullable().default(null),
  assignee: idSchema.nullable().default(null),
  recipient: idSchema.nullable().default(null),
  referred_by: idSchema.nullable().default(null),
  place: googleAutocompleteSuggestionSchema.nullable().default(null),
  scheduled_at: z.string().datetime().nullable().default(null),
  completed_at: z.string().datetime().nullable().default(null),
});

export const jobUpdateSchema = z.object({
  label: z.string().max(255).nullable().optional(),
  description: z.string().max(1024).nullable().optional(),
  representative: idSchema.nullable().optional(),
  assignee: idSchema.nullable().optional(),
  recipient: idSchema.nullable().optional(),
  referred_by: idSchema.nullable().optional(),
  place: googleAutocompleteSuggestionSchema.nullable().optional(),
  scheduled_at: z.string().datetime().nullable().optional(),
  completed_at: z.string().datetime().nullable().optional(),
});

export const jobListRequestSchema = listRequestSchema.extend({
  params: listRequestSchema.shape.params.extend({
    ordering: z.nativeEnum(EJobListOrdering).default(EJobListOrdering.LabelAsc),
    completed: z.boolean().optional(),
    scheduled: z.boolean().optional(),
  }),
});

export const jobListResponseSchema = listResponseSchema.extend({
  results: z.array(jobSchema),
});
