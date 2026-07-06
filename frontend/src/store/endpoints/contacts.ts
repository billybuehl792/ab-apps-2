import api from "../config/api";
import type {
  TContact,
  TContactCreateRequest,
  TContactUpdateRequest,
  TContactListRequest,
  TContactListResponse,
  TContactDocumentListRequest,
  TContactDocumentListResponse,
  TContactHistoryListRequest,
  TContactHistoryListResponse,
} from "../types/contacts";
import type {
  TDocument,
  TDocumentCreate,
  TDocumentUpdate,
} from "../types/documents";
import { compressImage } from "../utils/image";

const contactEndpoints = {
  id: ["contacts"] as const,
  get: (options?: TContactListRequest) =>
    api
      .get<TContactListResponse>(`/contacts/`, options)
      .then(({ data }) => data),
  post: (body: TContactCreateRequest) =>
    api.post<TContact>(`/contacts/`, body).then(({ data }) => data),
  contact: (id: TContact["id"]) => ({
    id: ["contacts", "contact", id] as const,
    get: () => api.get<TContact>(`/contacts/${id}/`).then(({ data }) => data),
    patch: (body: TContactUpdateRequest) =>
      api.patch<TContact>(`/contacts/${id}/`, body).then(({ data }) => data),
    delete: () => api.delete<void>(`/contacts/${id}/`).then(({ data }) => data),
    documents: () => ({
      id: ["contacts", "contact", id, "documents"] as const,
      get: (options?: TContactDocumentListRequest) =>
        api
          .get<TContactDocumentListResponse>(
            `/contacts/${id}/documents/`,
            options,
          )
          .then(({ data }) => data),
      post: async (body: TDocumentCreate) => {
        const formData = new FormData();
        const compressedFile = await compressImage(body.file);
        formData.append("file", compressedFile);
        formData.append("label", body.label);
        if (body.description) formData.append("description", body.description);
        return api
          .post<TDocument>(`/contacts/${id}/documents/`, formData)
          .then(({ data }) => data);
      },
      document: (documentId: TDocument["id"]) => ({
        id: ["contacts", "contact", id, "documents", documentId] as const,
        get: () =>
          api
            .get<TDocument>(`/contacts/${id}/documents/${documentId}/`)
            .then(({ data }) => data),
        patch: (body: TDocumentUpdate) =>
          api
            .patch<TDocument>(`/contacts/${id}/documents/${documentId}/`, body)
            .then(({ data }) => data),
        delete: () =>
          api
            .delete<void>(`/contacts/${id}/documents/${documentId}/`)
            .then(({ data }) => data),
      }),
    }),
    history: () => ({
      id: ["contacts", "contact", id, "history"] as const,
      get: (options?: TContactHistoryListRequest) =>
        api
          .get<TContactHistoryListResponse>(`/contacts/${id}/history/`, options)
          .then(({ data }) => data),
    }),
  }),
};

export default contactEndpoints;
