import z from "zod";
import { listRequestSchema } from "./api";
import { EWorkOrderListOrdering, WorkOrderStatus } from "../enums/work-orders";
import { idSchema } from "./basic";

export const workOrderListRequestSchema = listRequestSchema.extend({
  params: listRequestSchema.shape.params.extend({
    ordering: z
      .nativeEnum(EWorkOrderListOrdering)
      .nullable()
      .optional()
      .catch(undefined)
      .transform((val) => val ?? EWorkOrderListOrdering.CreatedAsc),
    status: z
      .union([
        z.nativeEnum(WorkOrderStatus),
        z.array(z.nativeEnum(WorkOrderStatus)),
      ])
      .transform((val) => Array.from(new Set(Array.isArray(val) ? val : [val])))
      .pipe(z.array(z.nativeEnum(WorkOrderStatus)))
      .transform((val) => (!val || val.length === 0 ? undefined : val))
      .optional()
      .catch(undefined),
    client: z
      .union([idSchema, z.array(idSchema)])
      .transform((val) => Array.from(new Set(Array.isArray(val) ? val : [val])))
      .pipe(z.array(idSchema))
      .transform((val) => (!val || val.length === 0 ? undefined : val))
      .optional()
      .catch(undefined),
    city: z
      .union([idSchema, z.array(idSchema)])
      .transform((val) => Array.from(new Set(Array.isArray(val) ? val : [val])))
      .pipe(z.array(idSchema))
      .transform((val) => (!val || val.length === 0 ? undefined : val))
      .optional()
      .catch(undefined),
  }),
});
