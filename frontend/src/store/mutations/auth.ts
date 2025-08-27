import { mutationOptions } from "@tanstack/react-query";
import api from "../api";
import ROUTES from "../constants/routes";
import { authUtils } from "../utils/auth";
import type { Credentials } from "../types";

const signIn = () =>
  mutationOptions({
    mutationKey: ["accessToken"],
    mutationFn: async (credentials: Credentials) => {
      const res = await api.post<{ access: string }>(
        ROUTES.AUTH.TOKEN,
        credentials
      );
      authUtils.setAccessToken(res.data.access);

      return res.data;
    },
  });

const signOut = () =>
  mutationOptions({
    mutationKey: ["signOut"],
    mutationFn: async () => {
      const res = await api.post<{ detail: string }>(ROUTES.AUTH.SIGN_OUT);
      authUtils.setAccessToken(null);

      return res.data;
    },
  });

const refreshAccessToken = () =>
  mutationOptions({
    mutationKey: ["refreshToken"],
    mutationFn: async () => {
      const res = await api.post<{ access: string }>(ROUTES.AUTH.TOKEN_REFRESH);
      authUtils.setAccessToken(res.data.access);

      return res.data;
    },
  });

export const authMutations = {
  signIn,
  signOut,
  refreshAccessToken,
};
