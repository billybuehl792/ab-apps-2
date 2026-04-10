import { Cases, MedicalServices, Work } from "@mui/icons-material";
import api from "../config/api";
import type {
  TJob,
  TJobCreate,
  TJobUpdate,
  TJobListRequest,
  TJobListResponse,
} from "../types/jobs";

/** Icons */

export const JobIcons = {
  List: Cases,
  Detail: Work,
  Create: MedicalServices,
};

/** API */

export const jobEndpoints = {
  id: ["jobs"] as const,
  url: `${import.meta.env.VITE_BACKEND_BASE_URL}/api/jobs/`,
  get: (options?: TJobListRequest) =>
    api
      .get<TJobListResponse>(jobEndpoints.url, options)
      .then((res) => res.data),
  post: (body: TJobCreate) =>
    api.post<TJob>(jobEndpoints.url, body).then((res) => res.data),
  job: (id: TJob["id"]) => ({
    id: [...jobEndpoints.id, "job", id] as const,
    url: `${jobEndpoints.url}${id}/`,
    get: () => api.get<TJob>(jobEndpoints.job(id).url).then((res) => res.data),
    patch: (body: TJobUpdate) =>
      api.patch<TJob>(jobEndpoints.job(id).url, body).then((res) => res.data),
    delete: () =>
      api.delete<void>(jobEndpoints.job(id).url).then((res) => res.data),
  }),
};

/** Other */

export const getPlaceholderJob = (
  data: TWithRequired<Partial<TJob>, "id">,
): TJob => ({
  label: "",
  description: "",
  assignee: null,
  recipient: null,
  scheduled_at: null,
  completed_at: null,
  created_at: "",
  updated_at: "",
  ...data,
});
