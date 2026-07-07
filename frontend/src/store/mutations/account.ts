import { mutationOptions } from "@tanstack/react-query";
import { authEndpoints, usersEndpoints } from "../endpoints/account";
import type { TUser } from "../types/account";

export const authMutations = {
  signIn: mutationOptions({
    mutationKey: ["account", "auth", "signIn"] as const,
    mutationFn: authEndpoints.token.post,
  }),
  refresh: mutationOptions({
    mutationKey: ["account", "auth", "refresh"] as const,
    mutationFn: authEndpoints.token.refresh.post,
  }),
  signOut: mutationOptions({
    mutationKey: ["account", "auth", "signOut"] as const,
    mutationFn: authEndpoints.token.revoke.post,
  }),
  requestPasswordReset: mutationOptions({
    mutationKey: ["account", "auth", "requestPasswordReset"] as const,
    mutationFn: authEndpoints.requestPasswordReset.post,
  }),
  resetPassword: (options: { encodedUserId: string; token: string }) =>
    mutationOptions({
      mutationKey: ["account", "auth", "resetPassword", options] as const,
      mutationFn: authEndpoints.resetPassword(options).post,
    }),
};

export const usersMutations = {
  create: mutationOptions({
    mutationKey: ["account", "users", "create"] as const,
    mutationFn: usersEndpoints.post,
  }),
  delete: mutationOptions({
    mutationKey: ["account", "users", "user", "delete"] as const,
    mutationFn: (id: TUser["id"]) => usersEndpoints.user(id).delete(),
  }),
  user: (id: TUser["id"]) => ({
    update: mutationOptions({
      mutationKey: ["account", "users", "user", "update", id] as const,
      mutationFn: usersEndpoints.user(id).patch,
    }),
    delete: mutationOptions({
      mutationKey: ["account", "users", "user", "delete", id] as const,
      mutationFn: usersEndpoints.user(id).delete,
    }),
  }),
};

export const accountMutations = {
  auth: authMutations,
  users: usersMutations,
};
