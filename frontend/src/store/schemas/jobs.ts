import z from "zod";
import { listRequestSchema, listResponseSchema } from "./api";
import { idSchema } from "./basic";
import { googleAutocompleteSuggestionSchema, placeBasicSchema } from "./places";
import { EJobListOrdering } from "../enums/jobs";
import { contactSchema } from "./contacts";

export const jobSchema = z.object({
  id: idSchema,
  description: z.string().default(""),
  categories: z.array(z.string()).default([]),
  amount: z.number().nullable().default(null),
  paid: z.number().nullable().default(null),
  representatives: z.array(contactSchema).default([]),
  assignees: z.array(contactSchema).default([]),
  recipients: z.array(contactSchema).default([]),
  referred_by: z.array(contactSchema).default([]),
  place: placeBasicSchema.nullable().default(null),
  documents: z.array(idSchema).default([]),
  signed_at: z.string().datetime().nullable().default(null),
  estimated_at: z.string().datetime().nullable().default(null),
  sold_at: z.string().datetime().nullable().default(null),
  invoiced_at: z.string().datetime().nullable().default(null),
  scheduled_at: z.string().datetime().nullable().default(null),
  completed_at: z.string().datetime().nullable().default(null),
  paid_at: z.string().datetime().nullable().default(null),
  created_at: z.string().datetime().nullable().default(null),
  updated_at: z.string().datetime().nullable().default(null),
});

export const jobCreateSchema = z.object({
  description: z.string().default(""),
  categories: z.array(z.string()).default([]),
  amount: z.number().nullable().default(null),
  paid: z.number().nullable().default(null),
  representatives: z.array(idSchema).default([]),
  assignees: z.array(idSchema).default([]),
  recipients: z.array(idSchema).default([]),
  referred_by: z.array(idSchema).default([]),
  place: googleAutocompleteSuggestionSchema.nullable().default(null),
  signed_at: z.string().datetime().nullable().default(null),
  estimated_at: z.string().datetime().nullable().default(null),
  scheduled_at: z.string().datetime().nullable().default(null),
  completed_at: z.string().datetime().nullable().default(null),
  sold_at: z.string().datetime().nullable().default(null),
  invoiced_at: z.string().datetime().nullable().default(null),
  paid_at: z.string().datetime().nullable().default(null),
});

export const jobUpdateSchema = z.object({
  description: z.string().max(1024).nullable().optional(),
  categories: z.array(z.string()).optional(),
  amount: z.number().nullable().optional(),
  paid: z.number().nullable().optional(),
  representatives: z.array(idSchema).optional(),
  assignees: z.array(idSchema).optional(),
  recipients: z.array(idSchema).optional(),
  referred_by: z.array(idSchema).optional(),
  place: googleAutocompleteSuggestionSchema.nullable().optional(),
  signed_at: z.string().datetime().nullable().optional(),
  estimated_at: z.string().datetime().nullable().optional(),
  scheduled_at: z.string().datetime().nullable().optional(),
  completed_at: z.string().datetime().nullable().optional(),
  sold_at: z.string().datetime().nullable().optional(),
  invoiced_at: z.string().datetime().nullable().optional(),
  paid_at: z.string().datetime().nullable().optional(),
});

export const jobListRequestSchema = listRequestSchema.extend({
  params: listRequestSchema.shape.params.extend({
    ordering: z.nativeEnum(EJobListOrdering).optional(),
    city: z.string().optional(),
    completed: z.coerce.boolean().optional(),
    scheduled: z.coerce.boolean().optional(),
  }),
});

export const jobListResponseSchema = listResponseSchema.extend({
  results: z.array(jobSchema),
});
