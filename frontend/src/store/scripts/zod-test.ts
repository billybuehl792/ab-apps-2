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

const schema = z.object({
  name: z.string().default("test"),
  age: z.number().int().positive().default(29),
  status: z.enum(["active", "inactive"]).optional().catch(undefined),
});

console.log(schema.safeParse({}).data);
// { name: 'test', age: 29 }

console.log(schema.safeParse({ invalid_field: true, status: "invalid" }).data);
// { name: 'test', age: 29, status: undefined }

console.log(schema.safeParse({ name: "billy", status: "inactive" }).data);
// { name: 'billy', age: 29, status: 'inactive' }
