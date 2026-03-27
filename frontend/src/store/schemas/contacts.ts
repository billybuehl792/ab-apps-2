import z from "zod";
import { listRequestSchema, listResponseSchema } from "./api";
import {
  EContactListOrdering,
  EContactTagListOrdering,
} from "../enums/contacts";
import { googleAutocompleteSuggestionSchema, placeBasicSchema } from "./places";
import {
  emailSchema,
  idOrIdArraySchema,
  idSchema,
  nameSchema,
  phoneSchema,
} from "./basic";

export const contactTagSchema = z.object({
  id: idSchema,
  label: z.string().max(255),
  description: z.string().max(1024).nullable(),
  color: z.string().max(7).nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const contactTagCreateOrUpdateSchema = z.object({
  label: z.string().max(255),
  description: z.string().max(1024).nullable().optional(),
  color: z.string().max(7).nullable().optional(),
});

export const contactSchema = z.object({
  id: idSchema,
  first_name: nameSchema,
  last_name: nameSchema,
  email: emailSchema,
  phone_primary: phoneSchema,
  phone_secondary: phoneSchema.nullable(),
  place: placeBasicSchema.nullable(),
  documents: z.array(idSchema),
  tags: z.array(contactTagSchema),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const contactCreateSchema = z.object({
  first_name: nameSchema,
  last_name: nameSchema,
  email: emailSchema,
  phone_primary: phoneSchema,
  phone_secondary: phoneSchema.nullable().optional(),
  place: googleAutocompleteSuggestionSchema.nullable().optional(),
  tags: z.array(idSchema).nullable().optional(),
});

export const contactUpdateSchema = z.object({
  first_name: nameSchema.optional(),
  last_name: nameSchema.optional(),
  email: emailSchema.optional(),
  phone_primary: phoneSchema.optional(),
  phone_secondary: phoneSchema.nullable().optional(),
  place: googleAutocompleteSuggestionSchema.nullable().optional(),
  tags: z.array(idSchema).nullable().optional(),
});

export const contactListRequestSchema = listRequestSchema.extend({
  params: listRequestSchema.shape.params.extend({
    ordering: z
      .nativeEnum(EContactListOrdering)
      .default(EContactListOrdering.FirstNameAsc),
    city: idOrIdArraySchema
      .optional()
      .transform((val) => (val?.length ? val : undefined)),
    tag: idOrIdArraySchema
      .optional()
      .transform((val) => (val?.length ? val : undefined)),
  }),
});

export const contactListResponseSchema = listResponseSchema.extend({
  results: z.array(contactSchema),
});

export const contactTagListRequestSchema = listRequestSchema.extend({
  params: listRequestSchema.shape.params.extend({
    ordering: z
      .nativeEnum(EContactTagListOrdering)
      .default(EContactTagListOrdering.LabelAsc),
  }),
});

export const contactTagListResponseSchema = listResponseSchema.extend({
  results: z.array(contactTagSchema),
});
