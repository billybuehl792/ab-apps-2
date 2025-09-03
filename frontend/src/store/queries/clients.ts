import { queryOptions } from "@tanstack/react-query";
import { clientApi } from "../api/clients";
import { queryUtils } from "../utils/queries";

const detail = (id: Parameters<typeof clientApi.detail>[0]) =>
  queryOptions({
    queryKey: queryUtils.getQueryKey(["clients", "detail"], { id }),
    queryFn: ({ queryKey: [_, { id }] }) =>
      clientApi.detail(id).then((res) => res.data),
  });

const list = (params?: Parameters<typeof clientApi.list>[0]) =>
  queryOptions({
    queryKey: queryUtils.getQueryKey(["clients", "list"], params),
    queryFn: ({ queryKey: [_, params] }) =>
      clientApi.list(params).then((res) => res.data),
  });

export const clientQueries = {
  detail,
  list,
};
