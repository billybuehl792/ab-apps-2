import axios from "axios";
import ROUTES from "../constants/routes";
import { router } from "@/main";
import { authUtils } from "../utils/auth";
import { authMutations } from "../mutations/auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_BASE_URL,
  withCredentials: true,
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
    let error = requestError;

    if (
      !Object.values(ROUTES.AUTH).includes(originalRequest.url) &&
      requestError.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshAccessTokenResult = await authMutations
          .refreshAccessToken()
          .mutationFn?.call(undefined);

        if (!refreshAccessTokenResult)
          throw new Error("No access token returned");

        authUtils.setAccessToken(refreshAccessTokenResult.access);
        originalRequest.headers.Authorization = `Bearer ${refreshAccessTokenResult.access}`;

        return api(originalRequest);
      } catch (refreshErr) {
        error = refreshErr;
      }

      authUtils.setAccessToken(null);

      const pathname = router.state.location.pathname;
      const search = ["/", "/sign-in", "/sign-out"].includes(pathname)
        ? undefined
        : { redirect: pathname };

      router.navigate({ to: "/sign-out", replace: true, search });
    }

    return Promise.reject(error);
  }
);

export default api;
