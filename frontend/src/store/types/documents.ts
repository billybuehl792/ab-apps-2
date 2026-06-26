import { z } from "zod";
import {
  documentCreateSchema,
  documentListRequestSchema,
  documentListResponseSchema,
  documentSchema,
} from "../schemas/documents";

export type TDocument = z.infer<typeof documentSchema>;

export type TDocumentCreate = z.infer<typeof documentCreateSchema>;

export interface TDocumentUpdate {
  label?: string;
  description?: string;
}

export type TDocumentListRequest = z.infer<typeof documentListRequestSchema>;

export type TDocumentListResponse = z.infer<typeof documentListResponseSchema>;
