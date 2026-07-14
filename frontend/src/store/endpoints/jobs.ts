import api from "../config/api";
import { compressImage } from "../utils/image";
import type {
  TJob,
  TJobCreateRequest,
  TJobUpdateRequest,
  TJobListRequest,
  TJobListResponse,
  TJobDocumentListRequest,
  TJobHistoryListRequest,
  TJobDocumentListResponse,
  TJobHistoryListResponse,
} from "../types/jobs";
import type {
  TDocument,
  TDocumentCreate,
  TDocumentUpdate,
} from "../types/documents";

export const jobEndpoints = {
  get: (body?: TJobListRequest) =>
    api.get<TJobListResponse>("/jobs/", body).then((res) => res.data),
  post: (body: TJobCreateRequest) =>
    api.post<TJob>("/jobs/", body).then((res) => res.data),
  job: (id: TJob["id"]) => ({
    get: () => api.get<TJob>(`/jobs/${id}/`).then((res) => res.data),
    patch: (body: TJobUpdateRequest) =>
      api.patch<TJob>(`/jobs/${id}/`, body).then((res) => res.data),
    delete: () => api.delete<void>(`/jobs/${id}/`).then((res) => res.data),
    documents: {
      get: (body: TJobDocumentListRequest) =>
        api
          .get<TJobDocumentListResponse>(`/jobs/${id}/documents/`, body)
          .then((res) => res.data),
      post: async (body: TDocumentCreate) => {
        const formData = new FormData();
        const compressedFile = await compressImage(body.file);
        formData.append("file", compressedFile);
        formData.append("label", body.label);
        if (body.description) formData.append("description", body.description);
        return api
          .post<TDocument>(`/jobs/${id}/documents/`, formData)
          .then(({ data }) => data);
      },
      document: (dId: TDocument["id"]) => ({
        get: () =>
          api
            .get<TDocument>(`/jobs/${id}/documents/${dId}/`)
            .then((res) => res.data),
        patch: (body: TDocumentUpdate) =>
          api
            .patch<TDocument>(`/jobs/${id}/documents/${dId}/`, body)
            .then(({ data }) => data),
        delete: () =>
          api
            .delete<void>(`/jobs/${id}/documents/${dId}/`)
            .then((res) => res.data),
      }),
    },
    history: {
      get: (body?: TJobHistoryListRequest) =>
        api
          .get<TJobHistoryListResponse>(`/jobs/${id}/history/`, body)
          .then((res) => res.data),
    },
  }),
};
