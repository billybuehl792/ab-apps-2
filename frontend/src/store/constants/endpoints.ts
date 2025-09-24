const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;
const API_URL = BASE_URL + "/api";

const endpoints = {
  account: Object.assign(() => `${API_URL}/account/`, {
    me: () => `${endpoints.account()}me/`,
    token: Object.assign(() => `${endpoints.account()}token/`, {
      refresh: () => `${endpoints.account.token()}refresh/`,
      revoke: () => `${endpoints.account.token()}revoke/`,
    }),
    users: Object.assign(() => `${endpoints.account()}users/`, {
      detail: (id: number) => `${endpoints.account.users()}${id}/`,
      count: () => `${endpoints.account.users()}count/`,
    }),
  }),
  places: Object.assign(() => `${API_URL}/places/`, {
    detail: (id: number) => `${endpoints.places()}${id}/`,
    cities: () => `${endpoints.places()}cities/`,
    googlePlace: () => `${endpoints.places()}google-place/`,
    googleAutocompleteSuggestions: () =>
      `${endpoints.places()}google-autocomplete-suggestions/`,
  }),
  clients: Object.assign(() => `${API_URL}/clients/`, {
    detail: (id: number) => `${endpoints.clients()}${id}/`,
    count: () => `${endpoints.clients()}count/`,
  }),
  workOrders: Object.assign(() => `${API_URL}/work-orders/`, {
    detail: (id: number) => `${endpoints.workOrders()}${id}/`,
    count: () => `${endpoints.workOrders()}count/`,
  }),
};

export default endpoints;
