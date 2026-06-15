import { Cases, MedicalServices, Work } from "@mui/icons-material";
import api from "../config/api";
import { EJobListOrdering } from "../enums/jobs";
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
  url: "/jobs/",
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

export const jobListOrderingOptions: Record<
  string,
  TOrderingOption<EJobListOrdering>
> = {
  label: {
    id: "label",
    label: "Label",
    value: {
      asc: EJobListOrdering.LabelAsc,
      desc: EJobListOrdering.LabelDesc,
    },
  },
  representative: {
    id: "representative",
    label: "Representative",
    value: {
      asc: EJobListOrdering.RepresentativeAsc,
      desc: EJobListOrdering.RepresentativeDesc,
    },
  },
  recipient: {
    id: "recipient",
    label: "Recipient",
    value: {
      asc: EJobListOrdering.RecipientAsc,
      desc: EJobListOrdering.RecipientDesc,
    },
  },
  assignee: {
    id: "assignee",
    label: "Assignee",
    value: {
      asc: EJobListOrdering.AssigneeAsc,
      desc: EJobListOrdering.AssigneeDesc,
    },
  },
  referredBy: {
    id: "referredBy",
    label: "Referred By",
    value: {
      asc: EJobListOrdering.ReferredByAsc,
      desc: EJobListOrdering.ReferredByDesc,
    },
  },
  place: {
    id: "place",
    label: "Place",
    value: {
      asc: EJobListOrdering.PlaceAsc,
      desc: EJobListOrdering.PlaceDesc,
    },
  },
  amount: {
    id: "amount",
    label: "Amount",
    value: {
      asc: EJobListOrdering.AmountAsc,
      desc: EJobListOrdering.AmountDesc,
    },
  },
  createdAt: {
    id: "createdAt",
    label: "Created",
    value: {
      asc: EJobListOrdering.CreatedAtAsc,
      desc: EJobListOrdering.CreatedAtDesc,
    },
  },
  updatedAt: {
    id: "updatedAt",
    label: "Updated",
    value: {
      asc: EJobListOrdering.UpdatedAtAsc,
      desc: EJobListOrdering.UpdatedAtDesc,
    },
  },
};
