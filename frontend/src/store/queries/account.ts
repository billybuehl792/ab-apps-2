import { queryOptions } from "@tanstack/react-query";
import { queryUtils } from "../utils/queries";
import { accountApi } from "../api/account";
import { UserApiListRequest } from "../types/account";
import { paramUtils } from "../utils/params";

/** Account */

const me = () =>
  queryOptions({
    queryKey: queryUtils.getQueryKey(["account", "me"]),
    queryFn: () => accountApi.me().then((res) => res.data),
  });

/** Users  */

const detail = (id: number) =>
  queryOptions({
    queryKey: queryUtils.getQueryKey(["account", "users", "detail"], { id }),
    enabled: Boolean(id),
    queryFn: ({ queryKey: [_, { id }] }) =>
      accountApi.users.detail(id).then((res) => res.data),
  });

const list = (params?: UserApiListRequest) =>
  queryOptions({
    queryKey: queryUtils.getQueryKey(
      ["account", "users", "list"],
      paramUtils.cleanApiListRequestParams<UserApiListRequest>(params)
    ),
    queryFn: ({ queryKey: [_, params] }) =>
      accountApi.users.list(params).then((res) => res.data),
  });

const users = { detail, list };

export const accountQueries = { me, users };
