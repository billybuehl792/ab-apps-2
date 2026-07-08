import { z } from "zod";
import { idSchema } from "./basic";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;
const MAX_SEARCH_LENGTH = 100;

const pageParamSchema = z.coerce
  .number()
  .int()
  .positive()
  .default(DEFAULT_PAGE)
  .catch(DEFAULT_PAGE);

const pageSizeParamSchema = z.coerce
  .number()
  .int()
  .positive()
  .max(MAX_PAGE_SIZE, `Cannot exceed a page size of ${MAX_PAGE_SIZE}`)
  .default(DEFAULT_PAGE_SIZE)
  .catch(DEFAULT_PAGE_SIZE);

const searchParamSchema = z
  .string()
  .trim()
  .max(
    MAX_SEARCH_LENGTH,
    `Cannot exceed a search length of ${MAX_SEARCH_LENGTH} characters`,
  )
  .transform((val) => val || undefined)
  .optional()
  .catch(undefined);

export const listRequestSchema = z.object({
  params: z.object({
    page: pageParamSchema,
    page_size: pageSizeParamSchema,
    search: searchParamSchema,
  }),
});

export const listResponseSchema = z.object({
  count: z.number().int().nonnegative(),
  next: z.url().nullable(),
  previous: z.url().nullable(),
  results: z.array(z.object({ id: idSchema })),
});
