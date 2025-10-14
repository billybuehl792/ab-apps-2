export interface Document {
  id: number;
  label: string;
  description: string;
  file: string;
  original_filename: string;
  uploaded_at: string;
  mime_type: string;
  uploaded_by: number | null;
  created_at: string;
  updated_at: string;
}

export interface DocumentCreate {
  label: string;
  description?: string;
  file: string;
}

export interface DocumentUpdate {
  id: number;
  label?: string;
  description?: string;
}
