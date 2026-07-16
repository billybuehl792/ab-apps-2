import api from "../config/api";
import type {
  TDocument,
  TDocumentCreate,
  TDocumentListRequest,
  TDocumentListResponse,
  TDocumentUpdate,
} from "../types/documents";

const getDocumentCreateFormData = (body: TDocumentCreate) => {
  const formData = new FormData();
  formData.append("file", body.file);
  formData.append("label", body.label);
  formData.append("description", body.description ?? "");

  if (body.contact) formData.append("contact", String(body.contact));
  else if (body.job) formData.append("job", String(body.job));

  return formData;
};

const documentEndpoints = {
  get: (body?: TDocumentListRequest) =>
    api.get<TDocumentListResponse>("/documents/", body).then((res) => res.data),
  post: (body: TDocumentCreate) =>
    api
      .post<TDocument>("/documents/", getDocumentCreateFormData(body), {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => res.data),
  document: (id: TDocument["id"]) => ({
    get: () => api.get<TDocument>(`/documents/${id}/`).then((res) => res.data),
    patch: (body: TDocumentUpdate) =>
      api.patch<TDocument>(`/documents/${id}/`, body).then((res) => res.data),
    delete: () => api.delete<void>(`/documents/${id}/`).then((res) => res.data),
  }),
};

export default documentEndpoints;
