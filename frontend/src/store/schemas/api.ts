import { z } from "zod";
import { idSchema } from "./basic";
import { DEFAULT_LIST_PARAMS } from "../constants/api";

const pageParamSchema = z.coerce
  .number()
  .int()
  .positive()
  .optional()
  .transform((val) => val || DEFAULT_LIST_PARAMS.page)
  .catch(DEFAULT_LIST_PARAMS.page);

const pageSizeParamSchema = z.coerce
  .number()
  .int()
  .positive()
  .max(100)
  .optional()
  .transform((val) => val || DEFAULT_LIST_PARAMS.page_size)
  .catch(DEFAULT_LIST_PARAMS.page_size);

const searchParamSchema = z.coerce
  .string()
  .trim()
  .max(100)
  .optional()
  .transform((val) => val || undefined)
  .catch(DEFAULT_LIST_PARAMS.search);

export const listRequestSchema = z.object({
  params: z.object({
    page: pageParamSchema,
    page_size: pageSizeParamSchema,
    search: searchParamSchema,
  }),
});

export const listResponseSchema = z.object({
  count: z.number().nonnegative(),
  next: z.string().url().nullable(),
  previous: z.string().url().nullable(),
  results: z.array(z.object({ id: idSchema })),
});
