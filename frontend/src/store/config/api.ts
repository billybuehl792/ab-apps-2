import axios from "axios";
import qs from "qs";
import endpoints from "../constants/endpoints";
import { router } from "@/main";
import { authUtils } from "../utils/auth";

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
    const ignoreRoutes = [
      endpoints.account.token(),
      endpoints.account.tokenRefresh(),
      endpoints.account.signOut(),
    ];

    if (
      !ignoreRoutes.includes(originalRequest.url) &&
      requestError.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshAccessTokenResult = await api.post<{
          access: string;
        }>(endpoints.account.tokenRefresh());

        if (refreshAccessTokenResult.status !== 200)
          throw new Error("Token refresh failed");

        const newToken = refreshAccessTokenResult.data.access;
        authUtils.setAccessToken(newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

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
