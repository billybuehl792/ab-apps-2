import { z } from "zod";
import { idSchema } from "./basic";

const pageParamSchema = z.coerce.number().int().positive().default(1);

const pageSizeParamSchema = z.coerce
  .number()
  .int()
  .positive()
  .max(100, "Cannot exceed a page size of 100")
  .default(20);

const searchParamSchema = z.coerce
  .string()
  .trim()
  .max(100, "Cannot exceed a search length of 100 characters")
  .transform((val) => val || undefined)
  .optional();

export const listRequestSchema = z.object({
  params: z.object({
    page: pageParamSchema,
    page_size: pageSizeParamSchema,
    search: searchParamSchema,
  }),
});

export const listResponseSchema = z.object({
  count: z.number().int().nonnegative(),
  next: z.string().url().nullable(),
  previous: z.string().url().nullable(),
  results: z.array(z.object({ id: idSchema })),
});
