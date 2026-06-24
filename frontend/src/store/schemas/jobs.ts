import z from "zod";
import { listRequestSchema, listResponseSchema } from "./api";
import { placeSchema } from "./places";
import { EJobCategory, EJobListOrdering } from "../enums/jobs";
import { contactSchema } from "./contacts";

export const jobSchema = z.object({
  id: z.string(),
  description: z.string().default(""),
  categories: z.array(z.enum(EJobCategory)).default([]),
  amount: z.number().nullable().default(null),
  paid: z.number().nullable().default(null),
  representatives: z.array(contactSchema).default([]),
  assignees: z.array(contactSchema).default([]),
  recipients: z.array(contactSchema).default([]),
  referred_by: z.array(contactSchema).default([]),
  place: placeSchema.nullable().default(null),
  documents: z.array(z.string()).default([]),
  signed_at: z.iso.datetime().nullable().default(null),
  estimated_at: z.iso.datetime().nullable().default(null),
  sold_at: z.iso.datetime().nullable().default(null),
  invoiced_at: z.iso.datetime().nullable().default(null),
  scheduled_at: z.iso.datetime().nullable().default(null),
  completed_at: z.iso.datetime().nullable().default(null),
  paid_at: z.iso.datetime().nullable().default(null),
  created_at: z.iso.datetime().nullable().default(null),
  updated_at: z.iso.datetime().nullable().default(null),
});

export const jobCreateSchema = z.object({
  description: z.string().optional(),
  categories: z.array(z.enum(EJobCategory)).optional(),
  amount: z.number().optional(),
  paid: z.number().optional(),
  representatives: z.array(z.string()).optional(),
  assignees: z.array(z.string()).optional(),
  recipients: z.array(z.string()).optional(),
  referred_by: z.array(z.string()).optional(),
  google_place_id: z.string().max(500).optional(),
  signed_at: z.iso.datetime().optional(),
  estimated_at: z.iso.datetime().optional(),
  scheduled_at: z.iso.datetime().optional(),
  completed_at: z.iso.datetime().optional(),
  sold_at: z.iso.datetime().optional(),
  invoiced_at: z.iso.datetime().optional(),
  paid_at: z.iso.datetime().optional(),
});

export const jobUpdateSchema = z.object({
  description: z.string().max(1024).nullable().optional(),
  categories: z.array(z.string()).optional(),
  amount: z.number().nullable().optional(),
  paid: z.number().nullable().optional(),
  representatives: z.array(z.string()).optional(),
  assignees: z.array(z.string()).optional(),
  recipients: z.array(z.string()).optional(),
  referred_by: z.array(z.string()).optional(),
  google_place_id: z.string().max(500).optional(),
  signed_at: z.iso.datetime().nullable().optional(),
  estimated_at: z.iso.datetime().nullable().optional(),
  scheduled_at: z.iso.datetime().nullable().optional(),
  completed_at: z.iso.datetime().nullable().optional(),
  sold_at: z.iso.datetime().nullable().optional(),
  invoiced_at: z.iso.datetime().nullable().optional(),
  paid_at: z.iso.datetime().nullable().optional(),
});

export const jobListRequestSchema = listRequestSchema.extend({
  params: listRequestSchema.shape.params.extend({
    ordering: z.enum(EJobListOrdering).optional(),
    city: z.string().optional(),
    completed: z.boolean().optional(),
    scheduled: z.boolean().optional(),
  }),
});

export const jobListResponseSchema = listResponseSchema.extend({
  results: z.array(jobSchema),
});
