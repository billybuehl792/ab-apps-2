import z from "zod";
import {
  jobSchema,
  jobCreateRequestSchema,
  jobUpdateRequestSchema,
  jobListRequestSchema,
  jobListResponseSchema,
  jobDocumentListResponseSchema,
  jobDocumentListRequestSchema,
  jobHistoryListRequestSchema,
  jobHistoryListResponseSchema,
} from "../schemas/jobs";

export type TJob = z.infer<typeof jobSchema>;

export type TJobCreateRequest = z.infer<typeof jobCreateRequestSchema>;

export type TJobUpdateRequest = z.infer<typeof jobUpdateRequestSchema>;

export type TJobListRequest = z.infer<typeof jobListRequestSchema>;

export type TJobListResponse = z.infer<typeof jobListResponseSchema>;

export type TJobDocumentListRequest = z.infer<
  typeof jobDocumentListRequestSchema
>;

export type TJobDocumentListResponse = z.infer<
  typeof jobDocumentListResponseSchema
>;

export type TJobHistoryListRequest = z.infer<
  typeof jobHistoryListRequestSchema
>;

export type TJobHistoryListResponse = z.infer<
  typeof jobHistoryListResponseSchema
>;
