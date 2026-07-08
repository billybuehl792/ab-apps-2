import z from "zod";
import { listRequestSchema, listResponseSchema } from "./api";
import { EContactListOrdering } from "../enums/contacts";
import { documentSchema } from "./documents";
import { placeSchema } from "./places";
import { idOrIdArraySchema, idSchema, phoneSchema } from "./basic";
import { historyEntrySchema } from "./history";

export const contactSchema = z.object({
  id: idSchema,
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.email("Invalid email address"),
  phone_primary: phoneSchema,
  phone_secondary: phoneSchema.nullable(),
  place: placeSchema.nullable(),
  documents: z.array(documentSchema),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
});

export const contactCreateRequestSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.email("Invalid email address"),
  phone_primary: phoneSchema,
  phone_secondary: phoneSchema.optional(),
  google_place_id: z.string().optional(),
});

export const contactUpdateRequestSchema = z.object({
  first_name: z.string().min(1, "First name is required").optional(),
  last_name: z.string().min(1, "Last name is required").optional(),
  email: z.email("Invalid email address").optional(),
  phone_primary: phoneSchema.optional(),
  phone_secondary: phoneSchema.nullable().optional(),
  google_place_id: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export const contactListRequestSchema = listRequestSchema.extend({
  params: listRequestSchema.shape.params.extend({
    ordering: z.enum(EContactListOrdering).optional().catch(undefined),
    city: idOrIdArraySchema
      .transform((val) => (val?.length ? val : undefined))
      .optional()
      .catch(undefined),
    tag: idOrIdArraySchema
      .transform((val) => (val?.length ? val : undefined))
      .optional()
      .catch(undefined),
  }),
});

export const contactListResponseSchema = listResponseSchema.extend({
  results: z.array(contactSchema),
});

export const contactDocumentListRequestSchema = listRequestSchema;

export const contactDocumentListResponseSchema = listResponseSchema.extend({
  results: z.array(documentSchema),
});

export const contactHistoryListRequestSchema = listRequestSchema;

export const contactHistoryListResponseSchema = listResponseSchema.extend({
  results: z.array(historyEntrySchema),
});
