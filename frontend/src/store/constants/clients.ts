import { Groups, Person, PersonAdd } from "@mui/icons-material";

/** Icons */

export const ClientIcons = {
  List: Groups,
  Detail: Person,
  Create: PersonAdd,
};

/** API */

export const clientEndpoints = {
  clients: Object.assign(
    () => `${import.meta.env.VITE_BACKEND_BASE_URL}/api/clients/`,
    {
      detail: (id: number) => `${clientEndpoints.clients()}${id}/`,
      count: () => `${clientEndpoints.clients()}count/`,
    }
  ),
};
