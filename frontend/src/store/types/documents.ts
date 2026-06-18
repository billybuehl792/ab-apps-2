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

export interface TDocumentCreate {
  file: File;
  label?: string;
  description?: string;
}

export interface TDocumentUpdate {
  label?: string;
  description?: string;
}
