import type {
  ApiListRequest,
  ApiListRequestBase,
  ApiListRequestFilters,
} from "../types/api";

/**
 * Get the base parameters for the API list request.
 * @param search - The search parameters from the URL.
 * @returns The base parameters for the API list request.
 */
const getApiListRequestBaseParams = <O extends string = string>(
  search: Record<string, unknown>
): ApiListRequestBase<O> => {
  const params: ApiListRequestBase<O> = {
    page:
      search?.page && Number(search.page) > 1 ? Number(search.page) : undefined,
    page_size: search?.page_size ? Number(search.page_size) : undefined,
    ordering: search?.ordering ? (search.ordering as O) : undefined,
    search: search?.search ? String(search.search) : undefined,
  };

  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => Boolean(value))
  );
};

/**
 * Get the filter parameters for the API list request.
 * @param params - The parameters from the URL.
 * @returns The filter parameters for the API list request.
 */
const getApiListRequestFilterParams = (params: Record<string, unknown>) => {
  const exclude = ["page", "page_size", "ordering", "search"];

  return Object.fromEntries(
    Object.entries(params).filter(
      ([key, value]) => !exclude.includes(key) && Boolean(value)
    )
  ) as ApiListRequestFilters;
};

/**
 * Get the parameters for the API list request from the URL search parameters.
 * @param search - The search parameters from the URL.
 * @returns The parameters for the API list request.
 */
const cleanSearch = <T extends ApiListRequest = ApiListRequest>(
  search: Record<string, unknown>
) => {
  return {
    ...getApiListRequestBaseParams(search),
    ...getApiListRequestFilterParams(search),
  } as T;
};

export const paramUtils = {
  getApiListRequestBaseParams,
  getApiListRequestFilterParams,
  cleanSearch,
};
