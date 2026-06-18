import z from "zod";
import {
  contactCreateSchema,
  contactListRequestSchema,
  contactListResponseSchema,
} from "./schemas";

export type TContactCreate = z.infer<typeof contactCreateSchema>;

export type TContactListRequest = z.infer<typeof contactListRequestSchema>;

export type TContactListResponse = z.infer<typeof contactListResponseSchema>;
