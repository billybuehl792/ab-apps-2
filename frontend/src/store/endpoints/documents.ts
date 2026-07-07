import api from "../config/api";
import type {
  TDocument,
  TDocumentCreate,
  TDocumentListRequest,
  TDocumentListResponse,
  TDocumentUpdate,
} from "../types/documents";

const documentEndpoints = {
  get: (body?: TDocumentListRequest) =>
    api.get<TDocumentListResponse>("/documents/", body).then((res) => res.data),
  post: (body: TDocumentCreate) => {
    const formData = new FormData();
    formData.append("file", body.file);
    if (body.label) formData.append("label", body.label);
    if (body.description) formData.append("description", body.description);
    return api
      .post<TDocument>("/documents/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => res.data);
  },
  document: (id: TDocument["id"]) => ({
    get: () => api.get<TDocument>(`/documents/${id}/`).then((res) => res.data),
    patch: (body: TDocumentUpdate) =>
      api.patch<TDocument>(`/documents/${id}/`, body).then((res) => res.data),
    delete: () => api.delete<void>(`/documents/${id}/`).then((res) => res.data),
  }),
};

export default documentEndpoints;
