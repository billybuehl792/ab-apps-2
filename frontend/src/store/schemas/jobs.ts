import z from "zod";
import { idOrIdArraySchema, idSchema } from "./basic";
import { listRequestSchema, listResponseSchema } from "./api";
import { contactSchema } from "./contacts";
import { placeSchema } from "./places";
import { documentSchema } from "./documents";
import { EJobCategory, EJobListOrdering, EJobStatus } from "../enums/jobs";
import { historyEntrySchema } from "./history";

export const jobSchema = z.object({
  id: idSchema,
  description: z.string(),
  status: z.enum(EJobStatus),
  categories: z.array(z.enum(EJobCategory)),
  amount: z.number().nullable(),
  paid: z.number().nullable(),
  representatives: z.array(contactSchema),
  assignees: z.array(contactSchema),
  recipients: z.array(contactSchema),
  referred_by: z.array(contactSchema),
  place: placeSchema.nullable(),
  documents: z.array(z.string()),
  signed_at: z.iso.datetime().nullable(),
  estimated_at: z.iso.datetime().nullable(),
  sold_at: z.iso.datetime().nullable(),
  invoiced_at: z.iso.datetime().nullable(),
  scheduled_at: z.iso.datetime().nullable(),
  completed_at: z.iso.datetime().nullable(),
  paid_at: z.iso.datetime().nullable(),
  created_at: z.iso.datetime().nullable(),
  updated_at: z.iso.datetime().nullable(),
});

export const jobCreateRequestSchema = z.object({
  description: z.string().optional(),
  categories: z.array(z.enum(EJobCategory)).optional(),
  amount: z.number().optional(),
  paid: z.number().optional(),
  representatives: z.array(idSchema).optional(),
  assignees: z.array(idSchema).optional(),
  recipients: z.array(idSchema).optional(),
  referred_by: z.array(idSchema).optional(),
  google_place_id: z.string().max(500).optional(),
  signed_at: z.iso.datetime().optional(),
  estimated_at: z.iso.datetime().optional(),
  scheduled_at: z.iso.datetime().optional(),
  completed_at: z.iso.datetime().optional(),
  sold_at: z.iso.datetime().optional(),
  invoiced_at: z.iso.datetime().optional(),
  paid_at: z.iso.datetime().optional(),
});

export const jobUpdateRequestSchema = z.object({
  description: z.string().max(1024).nullable().optional(),
  categories: z.array(z.enum(EJobCategory)).optional(),
  amount: z.number().nullable().optional(),
  paid: z.number().nullable().optional(),
  representatives: z.array(idSchema).optional(),
  assignees: z.array(idSchema).optional(),
  recipients: z.array(idSchema).optional(),
  referred_by: z.array(idSchema).optional(),
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
    recipients: idOrIdArraySchema.optional().catch(undefined),
    ordering: z.enum(EJobListOrdering).optional().catch(undefined),
    city: z.string().optional().catch(undefined),
    status: z.enum(EJobStatus).optional().catch(undefined),
  }),
});

export const jobListResponseSchema = listResponseSchema.extend({
  results: z.array(jobSchema),
});

export const jobDocumentListRequestSchema = listRequestSchema;

export const jobDocumentListResponseSchema = listResponseSchema.extend({
  results: z.array(documentSchema),
});

export const jobHistoryListRequestSchema = listRequestSchema;

export const jobHistoryListResponseSchema = listResponseSchema.extend({
  results: z.array(historyEntrySchema),
});
