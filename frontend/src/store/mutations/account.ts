import { mutationOptions } from "@tanstack/react-query";
import { accountApi } from "../api/account";
import { queryUtils } from "../utils/queries";

const token = () =>
  mutationOptions({
    mutationKey: queryUtils.getQueryKey(["account", "signIn"]),
    mutationFn: accountApi.auth.token,
  });

const tokenRefresh = () =>
  mutationOptions({
    mutationKey: queryUtils.getQueryKey(["account", "refreshToken"]),
    mutationFn: accountApi.auth.tokenRefresh,
  });

const tokenRevoke = () =>
  mutationOptions({
    mutationKey: queryUtils.getQueryKey(["account", "signOut"]),
    mutationFn: accountApi.auth.tokenRevoke,
  });

export const accountMutations = {
  auth: {
    token,
    tokenRefresh,
    tokenRevoke,
  },
};
