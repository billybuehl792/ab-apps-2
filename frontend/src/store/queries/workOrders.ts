import { queryOptions } from "@tanstack/react-query";
import { workOrderApi } from "../api/work-orders";

const detail = (id: Parameters<typeof workOrderApi.detail>[0]) =>
  queryOptions({
    queryKey: ["work-orders", "detail", id],
    queryFn: () => workOrderApi.detail(id).then((res) => res.data),
  });

const list = (params?: Parameters<typeof workOrderApi.list>[0]) =>
  queryOptions({
    queryKey: ["work-orders", "list", params],
    queryFn: () => workOrderApi.list(params).then((res) => res.data),
  });

export const workOrderQueries = {
  detail,
  list,
};
