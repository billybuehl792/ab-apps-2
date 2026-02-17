import z from "zod";
import { listRequestSchema, listResponseSchema } from "./api";
import { EClientListOrdering } from "../enums/clients";
import { placeBasicSchema } from "./places";
import { WorkOrderStatus } from "../enums/work-orders";
import {
  emailSchema,
  idOrIdArraySchema,
  idSchema,
  nameSchema,
  phoneSchema,
} from "./basic";

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

export const clientWriteableSchema = z.object({
  id: idSchema,
  first_name: nameSchema,
  last_name: nameSchema,
  email: emailSchema,
  phone_primary: phoneSchema,
  phone_secondary: phoneSchema.nullable(),
  place: placeBasicSchema.nullable(),
});

export const clientListRequestSchema = listRequestSchema.extend({
  params: listRequestSchema.shape.params.extend({
    ordering: z
      .nativeEnum(EClientListOrdering)
      .optional()
      .transform((val) => val || EClientListOrdering.FirstNameAsc)
      .catch(EClientListOrdering.FirstNameAsc),
    city: idOrIdArraySchema.optional(),
    work_order_status: z
      .union([
        z.nativeEnum(WorkOrderStatus),
        z.array(z.nativeEnum(WorkOrderStatus)),
      ])
      .transform((val) => Array.from(new Set(Array.isArray(val) ? val : [val])))
      .pipe(z.array(z.nativeEnum(WorkOrderStatus)).min(1))
      .optional(),
  }),
});

export const clientListResponseSchema = listResponseSchema.extend({
  results: z.array(clientSchema),
});
