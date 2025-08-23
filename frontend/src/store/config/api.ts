import axios from "axios";
import ROUTES from "../constants/routes";
import { router } from "@/main";
import { authUtils } from "../utils/auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_BASE_URL,
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

    if (requestError.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = authUtils.getRefreshToken();

      if (refreshToken) {
        try {
          const res = await axios.post(ROUTES.AUTH.TOKEN_REFRESH, {
            refresh: refreshToken,
          });
          const { access, refresh } = res.data;

          authUtils.setTokens({ access, refresh });
          originalRequest.headers.Authorization = `Bearer ${access}`;

          return api(originalRequest);
        } catch (refreshErr) {
          error = refreshErr;
        }
      }

      authUtils.revokeTokens();

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
