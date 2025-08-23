const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;
const API_URL = BASE_URL + "/api";

const ROUTES = {
  AUTH: {
    TOKEN: `${BASE_URL}/token/`,
    TOKEN_REFRESH: `${BASE_URL}/token/refresh/`,
    ME: `${BASE_URL}/me/`,
  },
  CLIENTS: {
    LIST: `${API_URL}/clients/`,
    DETAIL: (id: string) => `${API_URL}/clients/${id}/`,
  },
};

export default ROUTES;
