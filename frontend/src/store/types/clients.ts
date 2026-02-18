import z from "zod";
import {
  clientSchema,
  clientBasicSchema,
  clientCreateSchema,
  clientUpdateSchema,
  clientListRequestSchema,
  clientListResponseSchema,
} from "../schemas/clients";

export type TClient = z.infer<typeof clientSchema>;

export type TClientBasic = z.infer<typeof clientBasicSchema>;

export type TClientCreate = z.infer<typeof clientCreateSchema>;

export type TClientUpdate = z.infer<typeof clientUpdateSchema>;

export type TClientListRequest = z.infer<typeof clientListRequestSchema>;

export type TClientListResponse = z.infer<typeof clientListResponseSchema>;
