import axios from "axios";
import qs from "qs";
import { router } from "@/main";
import { authUtils } from "../utils/auth";
import { tokenEndpoints } from "../constants/account";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_BASE_URL,
  withCredentials: true,
  paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "repeat" }),
});

api.interceptors.request.use((config) => {
  const token = authUtils.getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (requestError) => {
    const originalRequest = requestError.config;

    if (
      !originalRequest.url.startsWith(tokenEndpoints.url) &&
      requestError.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshTokenResponse = await tokenEndpoints.refresh().post();

        authUtils.setAccessToken(refreshTokenResponse.access);
        originalRequest.headers.Authorization = `Bearer ${refreshTokenResponse.access}`;

        return api(originalRequest);
      } catch (refreshErr) {
        authUtils.setAccessToken(null);

        router.navigate({
          to: "/sign-out",
          replace: true,
          search: { redirect: router.state.location.pathname },
        });

        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(requestError);
  },
);

export default api;
