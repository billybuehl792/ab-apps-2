import api from "@/store/config/api";
import type { TContact, TContactUpdate, TContactUploadFile } from "./types";

const contactEndpoints = {
  get: (id: string) => api.get<TContact>(`/contacts/${id}/`),
  update: ({ id, ...body }: TContactUpdate) =>
    api.patch<TContact>(`/contacts/${id}/`, body),
  delete: (id: string) => api.delete<void>(`/contacts/${id}/`),
  documents: {
    post: ({ id, file }: TContactUploadFile) => {
      const formData = new FormData();
      formData.append("file", file);
      return api.post(`/contacts/${id}/documents/`, formData);
    },
  },
};

export default contactEndpoints;
