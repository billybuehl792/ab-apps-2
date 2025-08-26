import { mutationOptions } from "@tanstack/react-query";
import api from "../api";
import ROUTES from "../constants/routes";
import { authUtils } from "../utils/auth";
import type { Credentials } from "../types";

const setTokens = () =>
  mutationOptions({
    mutationKey: ["tokens"],
    mutationFn: async (credentials: Credentials) => {
      const res = await api.post<{ access: string; refresh: string }>(
        ROUTES.AUTH.TOKEN,
        credentials
      );

      authUtils.setTokens(res.data);

      return res.data;
    },
  });

const refreshAuthTokens = () =>
  mutationOptions({
    mutationKey: ["refreshAuthTokens"],
    mutationFn: async (body: { refresh: string }) => {
      const res = await api.post<{ access: string }>(
        ROUTES.AUTH.TOKEN_REFRESH,
        body
      );

      authUtils.setTokens(res.data);

      return res.data;
    },
  });

export const authMutations = {
  setTokens,
  refreshAuthTokens,
};
