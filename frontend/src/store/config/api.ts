import axios from "axios";
import qs from "qs";
import { router } from "@/main";
import { authUtils } from "../utils/auth";
import { accountApi } from "../api/account";
import { accountEndpoints } from "../constants/account";

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
      !originalRequest.url.startsWith(accountEndpoints.account.auth.token()) &&
      requestError.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshTokenResponse = await accountApi.auth.tokenRefresh();

        authUtils.setAccessToken(refreshTokenResponse.data.access);
        originalRequest.headers.Authorization = `Bearer ${refreshTokenResponse.data.access}`;

        return api(originalRequest);
      } catch (refreshErr) {
        authUtils.setAccessToken(null);

        const pathname = router.state.location.pathname;
        const search = ["/", "/sign-in", "/sign-out"].includes(pathname)
          ? undefined
          : { redirect: pathname };

        // Redirect to sign-in page
        router.navigate({ to: "/sign-out", replace: true, search });

        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(requestError);
  }
);

export default api;
