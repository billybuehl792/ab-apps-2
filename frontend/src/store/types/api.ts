import z from "zod";
import { listRequestSchema, listResponseSchema } from "../schemas/api";

export type TListRequest = z.infer<typeof listRequestSchema>;

export type TListResponse = z.infer<typeof listResponseSchema>;
