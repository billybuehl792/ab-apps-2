import axios from "axios";
import qs from "qs";
import { accountEndpoints } from "../endpoints/account";
import { getAccessToken, setAccessToken } from "../utils/auth";

const TOKEN_ENDPOINT = "account/auth/token/";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "repeat" }),
});

import { router } from "./router";

api.interceptors.request.use((config) => {
  const accessToken = getAccessToken();
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (requestError) => {
    const originalRequest = requestError.config;

    const isTokenEndpoint = originalRequest.url.startsWith(TOKEN_ENDPOINT);
    const isUnauthorized = requestError.response?.status === 401;
    const isRetry = Boolean(originalRequest._retry);

    if (isUnauthorized && !isTokenEndpoint && !isRetry) {
      originalRequest._retry = true;

      try {
        const res = await accountEndpoints.auth.token.refresh.post();
        setAccessToken(res.access);
        originalRequest.headers.Authorization = `Bearer ${res.access}`;

        return api(originalRequest);
      } catch (refreshErr) {
        router.navigate({
          to: "/sign-in",
          replace: true,
          search: { force: true, redirect: router.state.location.pathname },
        });

        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(requestError);
  },
);

export default api;
