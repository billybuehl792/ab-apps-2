import { z } from "zod";
import {
  documentCreateSchema,
  documentUpdateSchema,
  documentListRequestSchema,
  documentListResponseSchema,
  documentSchema,
} from "../schemas/documents";

export type TDocument = z.infer<typeof documentSchema>;

export type TDocumentCreate = z.infer<typeof documentCreateSchema>;

export type TDocumentUpdate = z.infer<typeof documentUpdateSchema>;

export type TDocumentListRequest = z.infer<typeof documentListRequestSchema>;

export type TDocumentListResponse = z.infer<typeof documentListResponseSchema>;
