import { z } from "zod";
import { fallback } from "@tanstack/zod-adapter";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "../constants/api";

const pageParamSchema = fallback(
  z.coerce
    .number()
    .nullable()
    .optional()
    .transform((val) =>
      val ? (isNaN(val) || val <= DEFAULT_PAGE ? undefined : val) : undefined
    ),
  undefined
);

const pageSizeParamSchema = fallback(
  z.coerce
    .number()
    .nullable()
    .optional()
    .transform((val) =>
      val
        ? isNaN(val) || val === DEFAULT_PAGE_SIZE
          ? undefined
          : Math.min(Math.max(val, 1), 100)
        : undefined
    ),
  undefined
);

const searchParamSchema = fallback(
  z
    .string()
    .nullable()
    .optional()
    .transform((val) => (!val?.trim() ? undefined : val)),
  undefined
);

const orderingParamSchema = fallback(
  z
    .string()
    .nullable()
    .optional()
    .transform((val) => (val ? val : undefined)),
  undefined
);

export const listParamsSchema = z.object({
  page: pageParamSchema,
  page_size: pageSizeParamSchema,
  search: searchParamSchema,
  ordering: orderingParamSchema,
});
