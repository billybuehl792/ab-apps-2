import { z } from "zod";
import {
  documentCreateSchema,
  documentListRequestSchema,
  documentListResponseSchema,
} from "../schemas/documents";

export interface TDocument {
  id: number;
  label: string;
  description: string;
  file: string;
  thumbnail: string | null;
  original_filename: string;
  mime_type: string;
  uploaded_by: number | null;
  created_at: string;
  updated_at: string;
}

export type TDocumentCreate = z.infer<typeof documentCreateSchema>;

export interface TDocumentUpdate {
  label?: string;
  description?: string;
}

export type TDocumentListRequest = z.infer<typeof documentListRequestSchema>;

export type TDocumentListResponse = z.infer<typeof documentListResponseSchema>;
