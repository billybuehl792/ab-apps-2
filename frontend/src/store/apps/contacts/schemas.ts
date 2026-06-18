import { z } from "zod";
import { listRequestSchema, listResponseSchema } from "@/store/schemas/api";
import { idOrIdArraySchema } from "@/store/schemas/basic";
import { contactSchema } from "./contact/schemas";
import { RegexPattern } from "@/store/constants/regex";
import { EContactListOrdering } from "./enums";

export const contactCreateSchema = z.object({
  first_name: z.string().min(1).max(100, "Cannot exceed 100 characters"),
  last_name: z.string().min(1).max(100, "Cannot exceed 100 characters"),
  email: z.coerce
    .string()
    .max(100, "Cannot exceed 100 characters")
    .email("Invalid email address"),
  phone_primary: z.coerce
    .string()
    .regex(RegexPattern.Phone, "Invalid phone number format"),
  phone_secondary: z.coerce
    .string()
    .regex(RegexPattern.Phone, "Invalid phone number format")
    .optional(),
  google_place_id: z.string().optional(),
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
