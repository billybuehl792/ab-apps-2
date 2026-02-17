import { queryOptions } from "@tanstack/react-query";
import { clientApi } from "../api/clients";
import { queryUtils } from "../utils/queries";
import { clientListRequestSchema } from "../schemas/clients";
import { EQueryType } from "../enums/api";

const list = (...[options]: Parameters<typeof clientApi.list>) =>
  queryOptions({
    queryKey: queryUtils.getQueryKey(
      ["clients", EQueryType.List],
      clientListRequestSchema.safeParse(options).data,
    ),
    queryFn: ({ queryKey: [_, options] }) =>
      clientApi.list(options).then((res) => res.data),
  });

const count = (...[options]: Parameters<typeof clientApi.count>) =>
  queryOptions({
    queryKey: queryUtils.getQueryKey(
      ["clients", EQueryType.Count],
      clientListRequestSchema.safeParse(options).data,
    ),
    queryFn: ({ queryKey: [_, options] }) =>
      clientApi.count(options).then((res) => res.data),
  });

const detail = (...[id]: Parameters<typeof clientApi.detail>) =>
  queryOptions({
    queryKey: queryUtils.getQueryKey(["clients", EQueryType.Detail], { id }),
    queryFn: ({ queryKey: [_, { id }] }) =>
      clientApi.detail(id).then((res) => res.data),
    enabled: Boolean(id) && !isNaN(id),
  });

export const clientQueries = {
  detail,
  list,
  count,
};
