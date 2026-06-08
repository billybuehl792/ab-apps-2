import z from "zod";
import {
  contactSchema,
  contactCreateSchema,
  contactUpdateSchema,
  contactListRequestSchema,
  contactListResponseSchema,
} from "../schemas/contacts";

export type TContact = z.infer<typeof contactSchema>;

export type TContactCreate = z.infer<typeof contactCreateSchema>;

export type TContactUpdate = z.infer<typeof contactUpdateSchema>;

export type TContactListRequest = z.infer<typeof contactListRequestSchema>;

export type TContactListResponse = z.infer<typeof contactListResponseSchema>;
