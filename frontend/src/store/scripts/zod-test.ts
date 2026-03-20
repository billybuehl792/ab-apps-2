import z from "zod";
import { fallback } from "@tanstack/zod-adapter";
import { idOrIdArraySchema } from "../schemas/basic";

const paramsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  ids: idOrIdArraySchema.default([]),
  city: idOrIdArraySchema
    .optional()
    .transform((val) => (val?.length ? val : undefined)),
});
const defaultParams = paramsSchema.parse({});
const routeParamsSchema = fallback(paramsSchema, defaultParams);

console.log(routeParamsSchema.parse({ page: 2, ids: [212] }));
