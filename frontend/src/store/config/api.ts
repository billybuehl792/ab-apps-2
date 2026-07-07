import axios from "axios";
import qs from "qs";
import router from "@/store/config/router";
import { authUtils } from "../utils/auth";
import { accountEndpoints } from "../endpoints/account";
import type { TAccessTokenResponse } from "../types/account";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "repeat" }),
});

api.interceptors.request.use((config) => {
  const token = authUtils.getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const TOKEN_ENDPOINT = "account/auth/token/";
let refreshPromise: Promise<TAccessTokenResponse> | null = null;
let reauthPromise: Promise<void> | null = null;

const fetchRefreshToken = () =>
  refreshPromise ??
  accountEndpoints.auth.token.refresh
    .post()
    .finally(() => (refreshPromise = null));

const handleReauth = () =>
  reauthPromise ??
  router
    .navigate({
      to: "/sign-in",
      replace: true,
      search: { force: true, redirect: router.state.location.pathname },
    })
    .finally(() => (reauthPromise = null));

api.interceptors.response.use(
  (response) => response,
  async (requestError) => {
    const originalRequest = requestError.config;

    if (
      !originalRequest.url.startsWith(TOKEN_ENDPOINT) &&
      requestError.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshTokenResponse = await fetchRefreshToken();

        authUtils.setAccessToken(refreshTokenResponse.access);
        originalRequest.headers.Authorization = `Bearer ${refreshTokenResponse.access}`;

        return api(originalRequest);
      } catch (refreshErr) {
        authUtils.setAccessToken(null);

        void handleReauth();

        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(requestError);
  },
);

export default api;
