import { mutationOptions } from "@tanstack/react-query";
import { accountApi } from "../api/account";
import { queryUtils } from "../utils/queries";

const token = () =>
  mutationOptions({
    mutationKey: queryUtils.getQueryKey(["account", "signIn"]),
    mutationFn: accountApi.token,
  });

const tokenRefresh = () =>
  mutationOptions({
    mutationKey: queryUtils.getQueryKey(["account", "refreshToken"]),
    mutationFn: accountApi.tokenRefresh,
  });

const tokenRevoke = () =>
  mutationOptions({
    mutationKey: queryUtils.getQueryKey(["account", "signOut"]),
    mutationFn: accountApi.tokenRevoke,
  });

export const accountMutations = {
  token,
  tokenRefresh,
  tokenRevoke,
};
