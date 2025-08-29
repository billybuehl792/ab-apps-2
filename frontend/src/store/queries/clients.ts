import { queryOptions } from "@tanstack/react-query";
import { clientApi } from "../api/clients";

const detail = (id: Parameters<typeof clientApi.detail>[0]) =>
  queryOptions({
    queryKey: ["clients", "detail", id],
    queryFn: () => clientApi.detail(id).then((res) => res.data),
  });

const list = (params?: Parameters<typeof clientApi.list>[0]) =>
  queryOptions({
    queryKey: ["clients", "list", params],
    queryFn: () => clientApi.list(params).then((res) => res.data),
  });

export const clientQueries = {
  detail,
  list,
};
