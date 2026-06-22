import { z } from "zod";
import { documentCreateSchema } from "../schemas/documents";

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
