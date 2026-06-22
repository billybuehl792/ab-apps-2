import z from "zod";
import { listRequestSchema, listResponseSchema } from "./api";
import { EContactListOrdering } from "../enums/contacts";
import { documentSchema } from "./documents";
import { placeSchema } from "./places";
import {
  emailSchema,
  idOrIdArraySchema,
  idSchema,
  nameSchema,
  phoneSchema,
} from "./basic";

export const contactSchema = z.object({
  id: idSchema,
  first_name: nameSchema,
  last_name: nameSchema,
  email: emailSchema,
  phone_primary: phoneSchema,
  phone_secondary: phoneSchema.nullable(),
  place: placeSchema.nullable(),
  documents: z.array(documentSchema),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const contactCreateSchema = z.object({
  first_name: nameSchema,
  last_name: nameSchema,
  email: emailSchema,
  phone_primary: phoneSchema,
  phone_secondary: phoneSchema.optional(),
  google_place_id: z.string().optional(),
});

export const contactUpdateSchema = z.object({
  first_name: nameSchema.optional(),
  last_name: nameSchema.optional(),
  email: emailSchema.optional(),
  phone_primary: phoneSchema.optional(),
  phone_secondary: phoneSchema.nullable().optional(),
  google_place_id: z.string().optional(),
  tags: z.array(idSchema).optional(),
});

export const contactListRequestSchema = listRequestSchema.extend({
  params: listRequestSchema.shape.params
    .extend({
      ordering: z.nativeEnum(EContactListOrdering).optional(),
      city: idOrIdArraySchema
        .optional()
        .transform((val) => (val?.length ? val : undefined)),
      tag: idOrIdArraySchema
        .optional()
        .transform((val) => (val?.length ? val : undefined)),
    })
    .default({ ordering: EContactListOrdering.FirstNameAsc }),
});

export const contactListResponseSchema = listResponseSchema.extend({
  results: z.array(contactSchema),
});

export const contactDocumentListRequestSchema = listRequestSchema;

export const contactDocumentListResponseSchema = listResponseSchema.extend({
  results: z.array(documentSchema),
});
