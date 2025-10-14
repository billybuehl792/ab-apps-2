import { queryOptions } from "@tanstack/react-query";
import { queryUtils } from "../utils/queries";
import { accountApi } from "../api/account";
import { UserListRequestParams } from "../types/account";
import { paramUtils } from "../utils/params";

/** Account */

const me = () =>
  queryOptions({
    queryKey: queryUtils.getQueryKey(["account", "me"]),
    queryFn: () => accountApi.auth.me().then((res) => res.data),
  });

/** Users  */

const detail = (id: number) =>
  queryOptions({
    queryKey: queryUtils.getQueryKey(["account", "users", "detail"], { id }),
    enabled: Boolean(id),
    queryFn: ({ queryKey: [_, { id }] }) =>
      accountApi.users.detail(id).then((res) => res.data),
  });

const list = (params?: UserListRequestParams) =>
  queryOptions({
    queryKey: queryUtils.getQueryKey(
      ["account", "users", "list"],
      paramUtils.cleanListRequestParamsParams<UserListRequestParams>(params)
    ),
    queryFn: ({ queryKey: [_, params] }) =>
      accountApi.users.list(params).then((res) => res.data),
  });

const count = (params?: UserListRequestParams) =>
  queryOptions({
    queryKey: queryUtils.getQueryKey(
      ["account", "users", "count"],
      paramUtils.cleanListRequestParamsParams<UserListRequestParams>(params)
    ),
    queryFn: ({ queryKey: [_, params] }) =>
      accountApi.users.count(params).then((res) => res.data),
  });

const users = { detail, list, count };

export const accountQueries = { me, users };
