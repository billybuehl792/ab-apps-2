import { queryOptions } from "@tanstack/react-query";
import { jobEndpoints } from "../endpoints/jobs";
import type {
  TJob,
  TJobHistoryListRequest,
  TJobDocumentListRequest,
  TJobListRequest,
} from "../types/jobs";
import type { TDocument } from "../types/documents";

export const jobQueries = {
  list: (body?: TJobListRequest) =>
    queryOptions({
      queryKey: ["jobs", "list", body],
      queryFn: () => jobEndpoints.get(body),
    }),
  job: (id: TJob["id"]) => ({
    detail: queryOptions({
      queryKey: ["jobs", "job", id],
      queryFn: jobEndpoints.job(id).get,
    }),
    documents: {
      list: (body: TJobDocumentListRequest) =>
        queryOptions({
          queryKey: ["jobs", "job", id, "documents", "list", body],
          queryFn: () => jobEndpoints.job(id).documents.get(body),
        }),
      document: (dId: TDocument["id"]) => ({
        detail: queryOptions({
          queryKey: ["jobs", "job", id, "documents", dId],
          queryFn: jobEndpoints.job(id).documents.document(dId).get,
        }),
      }),
    },
    history: {
      list: (body?: TJobHistoryListRequest) =>
        queryOptions({
          queryKey: ["jobs", "job", id, "history", "list", body],
          queryFn: () => jobEndpoints.job(id).history.get(body),
        }),
    },
  }),
};
