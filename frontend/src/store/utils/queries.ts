import { queryOptions } from "@tanstack/react-query";
import type { TQueryKey } from "../types/queries";
import type { AxiosResponse } from "axios";

export const getEndpointQueryKey = <
  TArgs extends unknown[],
  TResponse = unknown,
>(
  endpoint: {
    url: string;
    get: (...args: TArgs) => Promise<AxiosResponse<TResponse>>;
  },
  ...args: TArgs
) => {
  return args ? [endpoint.url, ...args] : [endpoint.url];
};

export const getEndpointQueryOptions = <
  TArgs extends unknown[],
  TResponse = unknown,
>(
  endpoint: {
    url: string;
    get: (...args: TArgs) => Promise<AxiosResponse<TResponse>>;
  },
  ...args: TArgs
) => {
  return queryOptions({
    queryKey: getEndpointQueryKey(endpoint, ...args),
    queryFn: () => endpoint.get(...args).then((res) => res.data),
  });
};

/**
 * Generates a query key for a specific query.
 * @param id - The unique identifier for the query.
 * @param options - Optional parameters to include in the query key.
 * @returns A unique query key.
 */
const getQueryKey = <O extends object | undefined = undefined>(
  id: ReadonlyArray<string>,
  options?: O,
) => {
  return (
    options instanceof Object
      ? ([id, options] as TQueryKey<O>)
      : ([id] as TQueryKey)
  ) as O extends object ? TQueryKey<O> : TQueryKey;
};

/**
 * A helper function that simulates a delay using a Promise.
 * @param ms - delay in milliseconds
 */
const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const queryUtils = { getQueryKey, delay };
