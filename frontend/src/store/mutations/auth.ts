import { mutationOptions } from "@tanstack/react-query";
import api from "../config/api";
import endpoints from "../constants/endpoints";
import { queryUtils } from "../utils/queries";
import { authUtils } from "../utils/auth";
import type { Credentials } from "../types/auth";

const signIn = () =>
  mutationOptions({
    mutationKey: queryUtils.getQueryKey(["auth", "signIn"]),
    mutationFn: async (credentials: Credentials) => {
      const res = await api.post<{ access: string }>(
        endpoints.auth.token(),
        credentials
      );
      authUtils.setAccessToken(res.data.access);

      return res.data;
    },
  });

const signOut = () =>
  mutationOptions({
    mutationKey: queryUtils.getQueryKey(["auth", "signOut"]),
    mutationFn: async () => {
      const res = await api.post<{ detail: string }>(endpoints.auth.signOut());
      authUtils.setAccessToken(null);

      return res.data;
    },
  });

const refreshAccessToken = () =>
  mutationOptions({
    mutationKey: queryUtils.getQueryKey(["auth", "refreshToken"]),
    mutationFn: async () => {
      const res = await api.post<{ access: string }>(
        endpoints.auth.tokenRefresh()
      );
      authUtils.setAccessToken(res.data.access);

      return res.data;
    },
  });

export const authMutations = {
  signIn,
  signOut,
  refreshAccessToken,
};
