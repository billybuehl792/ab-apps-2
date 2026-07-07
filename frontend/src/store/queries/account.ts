import { queryOptions } from "@tanstack/react-query";
import { authEndpoints, usersEndpoints } from "../endpoints/account";
import type { TUser, TUserListRequest } from "../types/account";

export const authQueries = {
  me: {
    detail: queryOptions({
      queryKey: ["account", "auth", "me"] as const,
      queryFn: authEndpoints.me.get,
    }),
  },
  resetPassword: (options: { encodedUserId: string; token: string }) => ({
    detail: queryOptions({
      queryKey: ["account", "auth", "resetPassword", options] as const,
      queryFn: authEndpoints.resetPassword(options).get,
    }),
  }),
};

export const usersQueries = {
  list: (body?: TUserListRequest) =>
    queryOptions({
      queryKey: ["account", "users", "list", body] as const,
      queryFn: () => usersEndpoints.get(body),
    }),
  user: (id: TUser["id"]) => ({
    detail: queryOptions({
      queryKey: ["account", "users", "user", id] as const,
      queryFn: usersEndpoints.user(id).get,
    }),
  }),
};

export const accountQueries = {
  auth: authQueries,
  users: usersQueries,
};
