import z from "zod";
import { listRequestSchema, listResponseSchema } from "./api";
import { EClientListOrdering } from "../enums/clients";
import { googleAutocompleteSuggestionSchema, placeBasicSchema } from "./places";
import {
  emailSchema,
  idOrIdArraySchema,
  idSchema,
  nameSchema,
  phoneSchema,
} from "./basic";
import { workOrderStatusOrWorkOrderStatusArraySchema } from "./work-orders";

export const clientSchema = z.object({
  id: idSchema,
  full_name: nameSchema,
  first_name: nameSchema,
  last_name: nameSchema,
  email: emailSchema,
  phone_primary: phoneSchema,
  phone_secondary: phoneSchema.nullable(),
  place: placeBasicSchema.nullable(),
  work_orders_count: z.number(),
  documents_count: z.number(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const clientBasicSchema = z.object({
  id: idSchema,
  full_name: nameSchema,
  email: emailSchema,
  phone_primary: phoneSchema,
  place: placeBasicSchema.nullable(),
});

export const clientCreateSchema = z.object({
  first_name: nameSchema,
  last_name: nameSchema,
  email: emailSchema,
  phone_primary: phoneSchema,
  phone_secondary: phoneSchema.nullable().optional(),
  place: googleAutocompleteSuggestionSchema.nullable().optional(),
});

export const clientUpdateSchema = z.object({
  first_name: nameSchema.optional(),
  last_name: nameSchema.optional(),
  email: emailSchema.optional(),
  phone_primary: phoneSchema.optional(),
  phone_secondary: phoneSchema.nullable().optional(),
  place: googleAutocompleteSuggestionSchema.nullable().optional(),
});

export const clientListRequestSchema = listRequestSchema.extend({
  params: listRequestSchema.shape.params.extend({
    ordering: z
      .nativeEnum(EClientListOrdering)
      .default(EClientListOrdering.FirstNameAsc),
    city: idOrIdArraySchema
      .optional()
      .transform((val) => (val?.length ? val : undefined)),
    work_order_status: workOrderStatusOrWorkOrderStatusArraySchema
      .optional()
      .transform((val) => (val?.length ? val : undefined)),
  }),
});

export const clientListResponseSchema = listResponseSchema.extend({
  results: z.array(clientSchema),
});
