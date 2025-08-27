const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;
const API_URL = BASE_URL + "/api";

const endpoints = {
  auth: Object.assign(() => `${API_URL}/account/`, {
    token: () => `${endpoints.auth()}token/`,
    tokenRefresh: () => `${endpoints.auth()}token/refresh/`,
    signOut: () => `${endpoints.auth()}sign-out/`,
    me: () => `${endpoints.auth()}me/`,
  }),
  clients: Object.assign(() => `${API_URL}/clients/`, {
    detail: (id: string) => `${endpoints.clients()}${id}/`,
  }),
};

export default endpoints;
