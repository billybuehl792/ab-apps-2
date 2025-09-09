const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;
const API_URL = BASE_URL + "/api";

const endpoints = {
  auth: Object.assign(() => `${API_URL}/account/`, {
    token: () => `${endpoints.auth()}token/`,
    tokenRefresh: () => `${endpoints.auth()}token/refresh/`,
    signOut: () => `${endpoints.auth()}sign-out/`,
    me: () => `${endpoints.auth()}me/`,
  }),
  places: Object.assign(() => `${API_URL}/places/`, {
    detail: (id: number) => `${endpoints.places()}${id}/`,
    googlePlace: () => `${endpoints.places()}google-place/`,
    googleSuggestions: () => `${endpoints.places()}google-suggestions/`,
  }),
  clients: Object.assign(() => `${API_URL}/clients/`, {
    detail: (id: number) => `${endpoints.clients()}${id}/`,
  }),
  workOrders: Object.assign(() => `${API_URL}/work-orders/`, {
    detail: (id: number) => `${endpoints.workOrders()}${id}/`,
  }),
};

export default endpoints;
