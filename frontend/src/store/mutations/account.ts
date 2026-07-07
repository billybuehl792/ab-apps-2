import { mutationOptions } from "@tanstack/react-query";
import { accountEndpoints } from "../endpoints/account";
import type { TUser } from "../types/account";

export const accountMutations = {
  auth: {
    signIn: mutationOptions({
      mutationKey: ["account", "auth", "signIn"] as const,
      mutationFn: accountEndpoints.auth.token.post,
    }),
    refresh: mutationOptions({
      mutationKey: ["account", "auth", "refresh"] as const,
      mutationFn: accountEndpoints.auth.token.refresh.post,
    }),
    signOut: mutationOptions({
      mutationKey: ["account", "auth", "signOut"] as const,
      mutationFn: accountEndpoints.auth.token.revoke.post,
    }),
    requestPasswordReset: mutationOptions({
      mutationKey: ["account", "auth", "requestPasswordReset"] as const,
      mutationFn: accountEndpoints.auth.requestPasswordReset.post,
    }),
    resetPassword: (options: { encodedUserId: string; token: string }) =>
      mutationOptions({
        mutationKey: ["account", "auth", "resetPassword", options] as const,
        mutationFn: accountEndpoints.resetPassword(options).post,
      }),
  },
  users: {
    create: mutationOptions({
      mutationKey: ["account", "users", "create"] as const,
      mutationFn: accountEndpoints.users.post,
    }),
    delete: mutationOptions({
      mutationKey: ["account", "users", "user", "delete"] as const,
      mutationFn: (id: TUser["id"]) => accountEndpoints.users.user(id).delete(),
    }),
    user: (id: TUser["id"]) => ({
      update: mutationOptions({
        mutationKey: ["account", "users", "user", "update", id] as const,
        mutationFn: accountEndpoints.users.user(id).patch,
      }),
      delete: mutationOptions({
        mutationKey: ["account", "users", "user", "delete", id] as const,
        mutationFn: accountEndpoints.users.user(id).delete,
      }),
    }),
  },
};
