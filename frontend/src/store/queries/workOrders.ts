import { queryOptions } from "@tanstack/react-query";
import { workOrderApi } from "../api/work-orders";
import { queryUtils } from "../utils/queries";

const detail = (id: Parameters<typeof workOrderApi.detail>[0]) =>
  queryOptions({
    queryKey: queryUtils.getQueryKey(["work-orders", "detail"], { id }),
    queryFn: ({ queryKey: [_, { id }] }) =>
      workOrderApi.detail(id).then((res) => res.data),
  });

const list = (params?: Parameters<typeof workOrderApi.list>[0]) =>
  queryOptions({
    queryKey: queryUtils.getQueryKey(["work-orders", "list"], params),
    queryFn: ({ queryKey: [_, params] }) =>
      workOrderApi.list(params).then((res) => res.data),
  });

export const workOrderQueries = {
  detail,
  list,
};
