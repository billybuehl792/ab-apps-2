import z from "zod";
import {
  contactSchema,
  contactCreateSchema,
  contactUpdateSchema,
  contactListRequestSchema,
  contactListResponseSchema,
  contactTagSchema,
  contactTagCreateOrUpdateSchema,
  contactTagListRequestSchema,
  contactTagListResponseSchema,
} from "../schemas/contacts";

export type TContact = z.infer<typeof contactSchema>;

export type TContactCreate = z.infer<typeof contactCreateSchema>;

export type TContactUpdate = z.infer<typeof contactUpdateSchema>;

export type TContactTag = z.infer<typeof contactTagSchema>;

export type TContactTagCreateOrUpdate = z.infer<
  typeof contactTagCreateOrUpdateSchema
>;

export type TContactListRequest = z.infer<typeof contactListRequestSchema>;

export type TContactListResponse = z.infer<typeof contactListResponseSchema>;

export type TContactTagListRequest = z.infer<
  typeof contactTagListRequestSchema
>;

export type TContactTagListResponse = z.infer<
  typeof contactTagListResponseSchema
>;
