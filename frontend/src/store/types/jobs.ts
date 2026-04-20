import z from "zod";
import {
  jobSchema,
  jobCreateSchema,
  jobUpdateSchema,
  jobListRequestSchema,
  jobListResponseSchema,
} from "../schemas/jobs";

export type TJob = z.infer<typeof jobSchema>;

export type TJobCreate = z.infer<typeof jobCreateSchema>;

export type TJobUpdate = z.infer<typeof jobUpdateSchema>;

export type TJobListRequest = z.infer<typeof jobListRequestSchema>;

export type TJobListResponse = z.infer<typeof jobListResponseSchema>;
