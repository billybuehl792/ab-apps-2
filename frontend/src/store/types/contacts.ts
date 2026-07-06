import z from "zod";
import {
  contactSchema,
  contactCreateRequestSchema,
  contactUpdateRequestSchema,
  contactListRequestSchema,
  contactListResponseSchema,
  contactDocumentListResponseSchema,
  contactDocumentListRequestSchema,
  contactHistoryListRequestSchema,
  contactHistoryListResponseSchema,
} from "../schemas/contacts";

export type TContact = z.infer<typeof contactSchema>;

export type TContactCreateRequest = z.infer<typeof contactCreateRequestSchema>;

export type TContactUpdateRequest = z.infer<typeof contactUpdateRequestSchema>;

export type TContactListRequest = z.infer<typeof contactListRequestSchema>;

export type TContactListResponse = z.infer<typeof contactListResponseSchema>;

export type TContactDocumentListRequest = z.infer<
  typeof contactDocumentListRequestSchema
>;

export type TContactDocumentListResponse = z.infer<
  typeof contactDocumentListResponseSchema
>;

export type TContactHistoryListRequest = z.infer<
  typeof contactHistoryListRequestSchema
>;

export type TContactHistoryListResponse = z.infer<
  typeof contactHistoryListResponseSchema
>;
