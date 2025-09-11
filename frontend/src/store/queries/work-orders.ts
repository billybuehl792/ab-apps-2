import { queryOptions } from "@tanstack/react-query";
import { workOrderApi } from "../api/work-orders";
import { queryUtils } from "../utils/queries";
import { paramUtils } from "../utils/params";
import type { WorkOrderApiListRequest } from "../types/work-orders";

const detail = (id: number) =>
  queryOptions({
    queryKey: queryUtils.getQueryKey(["work-orders", "detail"], { id }),
    enabled: Boolean(id),
    queryFn: ({ queryKey: [_, { id }] }) =>
      workOrderApi.detail(id).then((res) => res.data),
  });

const list = (params?: WorkOrderApiListRequest) =>
  queryOptions({
    queryKey: queryUtils.getQueryKey(
      ["work-orders", "list"],
      paramUtils.cleanApiListRequestParams<WorkOrderApiListRequest>(params)
    ),
    queryFn: ({ queryKey: [_, params] }) =>
      workOrderApi.list(params).then((res) => res.data),
  });

const count = (params?: WorkOrderApiListRequest) =>
  queryOptions({
    queryKey: queryUtils.getQueryKey(
      ["work-orders", "count"],
      paramUtils.cleanApiListRequestParams<WorkOrderApiListRequest>(params)
    ),
    queryFn: ({ queryKey: [_, params] }) =>
      workOrderApi.count(params).then((res) => res.data),
  });

export const workOrderQueries = {
  detail,
  list,
  count,
};
