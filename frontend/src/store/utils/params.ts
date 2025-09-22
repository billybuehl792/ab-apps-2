import type { ApiListRequest } from "../types/api";

/**
 * Sanitize parameters API list request parameters.
 * Remove all undefined values.
 * @param params - The search parameters from the URL.
 * @returns The parameters for the API list request.
 */
const cleanApiListRequestParams = <P extends ApiListRequest = ApiListRequest>(
  params?: Record<string, unknown>
): P => {
  const formatted = {
    ...params,
    page:
      params?.page && Number(params.page) > 1
        ? Math.max(Number(params.page), 1)
        : undefined,
    page_size: params?.page_size
      ? Math.min(Math.max(Number(params.page_size), 1), 20)
      : undefined,
    ordering: params?.ordering ? String(params.ordering) : undefined,
    search: params?.search ? String(params.search) : undefined,
  };

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
  cleanApiListRequestParams,
};
