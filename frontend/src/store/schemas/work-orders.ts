import z from "zod";
import { fallback } from "@tanstack/zod-adapter";
import { listParamsSchema } from "./api";
import {
  WorkOrderListRequestParamsOrdering,
  WorkOrderStatus,
} from "../enums/work-orders";

export const workOrderListParamsSchema = listParamsSchema.extend({
  ordering: fallback(
    z.nativeEnum(WorkOrderListRequestParamsOrdering).optional(),
    undefined
  ),
  status: fallback(
    z
      .union([
        z.nativeEnum(WorkOrderStatus),
        z.array(z.nativeEnum(WorkOrderStatus)),
      ])
      .transform((val) => (Array.isArray(val) ? val : [val]))
      .transform((val) => Array.from(new Set(val)))
      .transform((val) => (val.length === 0 ? undefined : val))
      .optional(),
    undefined
  ),
  client: fallback(
    z
      .union([
        z.coerce.number().int().positive(),
        z.array(z.coerce.number().int().positive()),
      ])
      .transform((val) => (Array.isArray(val) ? val : [val]))
      .transform((val) => Array.from(new Set(val)))
      .transform((val) => (val.length === 0 ? undefined : val))
      .optional(),
    undefined
  ),
  city: fallback(
    z
      .union([z.string().min(2).max(100), z.array(z.string().min(2).max(100))])
      .transform((val) => (Array.isArray(val) ? val : [val]))
      .transform((val) => Array.from(new Set(val)))
      .transform((val) => (val.length === 0 ? undefined : val))
      .optional(),
    undefined
  ),
});
