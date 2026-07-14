import { mutationOptions } from "@tanstack/react-query";
import { jobEndpoints } from "../endpoints/jobs";
import type { TJob } from "../types/jobs";
import { TDocument } from "../types/documents";

export const jobMutations = {
  create: mutationOptions({
    mutationKey: ["jobs", "create"] as const,
    mutationFn: jobEndpoints.post,
  }),
  delete: mutationOptions({
    mutationKey: ["jobs", "job", "delete"] as const,
    mutationFn: (id: TJob["id"]) => jobEndpoints.job(id).delete(),
  }),
  job: (id: TJob["id"]) => ({
    update: mutationOptions({
      mutationKey: ["jobs", "job", "update", id] as const,
      mutationFn: jobEndpoints.job(id).patch,
    }),
    delete: mutationOptions({
      mutationKey: ["jobs", "job", "delete", id] as const,
      mutationFn: jobEndpoints.job(id).delete,
    }),
    documents: {
      create: mutationOptions({
        mutationKey: ["jobs", "job", id, "documents", "create"] as const,
        mutationFn: jobEndpoints.job(id).documents.post,
      }),
      delete: mutationOptions({
        mutationKey: ["jobs", "job", id, "documents", "delete"] as const,
        mutationFn: (dId: TJob["id"]) =>
          jobEndpoints.job(id).documents.document(dId).delete(),
      }),
      document: (dId: TDocument["id"]) => ({
        update: mutationOptions({
          mutationKey: ["jobs", "job", id, "documents", "update", dId] as const,
          mutationFn: jobEndpoints.job(id).documents.document(dId).patch,
        }),
        delete: mutationOptions({
          mutationKey: ["jobs", "job", id, "documents", "delete", dId] as const,
          mutationFn: jobEndpoints.job(id).documents.document(dId).delete,
        }),
      }),
    },
  }),
};
