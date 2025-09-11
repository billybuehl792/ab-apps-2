import { mutationOptions } from "@tanstack/react-query";
import api from "../config/api";
import endpoints from "../constants/endpoints";
import { queryUtils } from "../utils/queries";
import { authUtils } from "../utils/auth";
import type { Credentials } from "../types/account";

const signIn = () =>
  mutationOptions({
    mutationKey: queryUtils.getQueryKey(["account", "signIn"]),
    mutationFn: async (credentials: Credentials) => {
      const res = await api.post<{ access: string }>(
        endpoints.account.token(),
        credentials
      );
      authUtils.setAccessToken(res.data.access);

      return res.data;
    },
  });

const signOut = () =>
  mutationOptions({
    mutationKey: queryUtils.getQueryKey(["account", "signOut"]),
    mutationFn: async () => {
      const res = await api.post<{ detail: string }>(
        endpoints.account.signOut()
      );
      authUtils.setAccessToken(null);

      return res.data;
    },
  });

const refreshAccessToken = () =>
  mutationOptions({
    mutationKey: queryUtils.getQueryKey(["account", "refreshToken"]),
    mutationFn: async () => {
      const res = await api.post<{ access: string }>(
        endpoints.account.tokenRefresh()
      );
      authUtils.setAccessToken(res.data.access);

      return res.data;
    },
  });

export const accountMutations = {
  signIn,
  signOut,
  refreshAccessToken,
};
