import z from "zod";
import {
  clientBasicSchema,
  clientListRequestSchema,
  clientListResponseSchema,
  clientSchema,
  clientWriteableSchema,
} from "../schemas/clients";

export type TClient = z.infer<typeof clientSchema>;

export type TClientBasic = z.infer<typeof clientBasicSchema>;

export type TClientWriteable = z.infer<typeof clientWriteableSchema>;

/** API */

export type TClientCreateBody = Omit<TClientWriteable, "id" | "full_name">;

export type TClientUpdateBody = Partial<TClientCreateBody> & { id: number };

export type TClientListRequest = z.infer<typeof clientListRequestSchema>;

export type TClientListResponse = z.infer<typeof clientListResponseSchema>;
