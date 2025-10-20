import type { ListRequestParams } from "../types/api";

const MAX_PAGE_SIZE = 100;

/**
 * Sanitize parameters for API list request.
 * @param params - The search parameters from the URL.
 * @returns The sanitized parameters for the API list request.
 */
const sanitizeListRequestParams = (
  params?: Record<string, unknown>
): ListRequestParams => {
  const formatted: ListRequestParams = {};

  if (params?.page && !isNaN(Number(params.page)) && Number(params.page) > 1)
    formatted["page"] = Math.max(Number(params.page), 1);
  if (params?.page_size && !isNaN(Number(params.page_size)))
    formatted["page_size"] = Math.min(
      Math.max(Number(params.page_size), 1),
      MAX_PAGE_SIZE
    );
  if (params?.ordering && !!String(params.ordering).trim())
    formatted["ordering"] = String(params.ordering);
  if (params?.search && !!String(params.search).trim())
    formatted["search"] = String(params.search);

  return formatted;
};

/**
 * Sanitize parameters API list request parameters.
 * Remove all undefined values.
 * @param params - The search parameters from the URL.
 * @returns The parameters for the API list request.
 */
const cleanListRequestParamsParams = <
  P extends ListRequestParams = ListRequestParams,
>(
  params?: Record<string, unknown>
): P => {
  const baseSanitizedParams = sanitizeListRequestParams(params);
  const formatted = { ...params, ...baseSanitizedParams };

  return Object.fromEntries(
    Object.entries(formatted).filter(
      ([, value]) =>
        value !== undefined &&
        value !== "" &&
        value !== null &&
        (Array.isArray(value) ? value.length > 0 : true)
    )
  ) as P;
};

export const paramUtils = {
  sanitizeListRequestParams,
  cleanListRequestParamsParams,
};
