import { queryOptions } from "@tanstack/react-query";
import type { TUser, TUserListRequest } from "../types/account";
import { accountEndpoints } from "../endpoints/account";

export const accountQueries = {
  auth: {
    me: {
      detail: queryOptions({
        queryKey: ["account", "auth", "me"] as const,
        queryFn: accountEndpoints.auth.me.get,
      }),
    },
    resetPassword: (options: { encodedUserId: string; token: string }) => ({
      detail: queryOptions({
        queryKey: ["account", "auth", "resetPassword", options] as const,
        queryFn: accountEndpoints.resetPassword(options).get,
      }),
    }),
  },
  users: {
    list: (body?: TUserListRequest) =>
      queryOptions({
        queryKey: ["account", "users", "list", body] as const,
        queryFn: () => accountEndpoints.users.get(body),
      }),
    user: (id: TUser["id"]) => ({
      detail: queryOptions({
        queryKey: ["account", "users", "user", id] as const,
        queryFn: accountEndpoints.users.user(id).get,
      }),
    }),
  },
};
