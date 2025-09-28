import { queryOptions } from "@tanstack/react-query";
import { clientApi } from "../api/clients";
import { queryUtils } from "../utils/queries";
import { paramUtils } from "../utils/params";
import type { ClientApiListRequest } from "../types/clients";

const detail = (id: number) =>
  queryOptions({
    queryKey: queryUtils.getQueryKey(["clients", "detail"], { id }),
    queryFn: ({ queryKey: [_, { id }] }) =>
      clientApi.detail(id).then((res) => res.data),
    enabled: Boolean(id) && !isNaN(id),
  });

const list = (params?: ClientApiListRequest) =>
  queryOptions({
    queryKey: queryUtils.getQueryKey(
      ["clients", "list"],
      paramUtils.cleanApiListRequestParams<ClientApiListRequest>(params)
    ),
    queryFn: ({ queryKey: [_, params] }) =>
      clientApi.list(params).then((res) => res.data),
  });

const count = (params?: ClientApiListRequest) =>
  queryOptions({
    queryKey: queryUtils.getQueryKey(
      ["clients", "count"],
      paramUtils.cleanApiListRequestParams<ClientApiListRequest>(params)
    ),
    queryFn: ({ queryKey: [_, params] }) =>
      clientApi.count(params).then((res) => res.data),
  });

export const clientQueries = {
  detail,
  list,
  count,
};
