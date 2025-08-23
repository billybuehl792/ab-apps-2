import { mutationOptions } from "@tanstack/react-query";
import api from "../config/api";
import ROUTES from "../constants/routes";
import { authUtils } from "../utils/auth";

const authenticateUser = () =>
  mutationOptions({
    mutationKey: ["authenticateUser"],
    mutationFn: async (credentials: { username: string; password: string }) => {
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
  authenticateUser,
  refreshAuthTokens,
};
