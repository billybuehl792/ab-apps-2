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
      params?.page && Number(params.page) > 1 ? Number(params.page) : undefined,
    page_size: params?.page_size ? Number(params.page_size) : undefined,
    ordering: params?.ordering ? String(params.ordering) : undefined,
    search: params?.search ? String(params.search) : undefined,
  };

  return Object.fromEntries(
    Object.entries(formatted).filter(([, value]) => value !== undefined)
  ) as P;
};

export const paramUtils = {
  cleanApiListRequestParams,
};
