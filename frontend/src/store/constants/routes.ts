const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;
const API_URL = BASE_URL + "/api";

const ROUTES = {
  AUTH: {
    TOKEN: `${API_URL}/account/token/`,
    TOKEN_REFRESH: `${API_URL}/account/token/refresh/`,
    SIGN_OUT: `${API_URL}/account/sign-out/`,
  },
  PROFILE: {
    ME: `${API_URL}/account/me/`,
  },
  CLIENTS: {
    LIST: `${API_URL}/clients/`,
    DETAIL: (id: string) => `${API_URL}/clients/${id}/`,
  },
};

export default ROUTES;
