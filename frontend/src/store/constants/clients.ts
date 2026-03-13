import { Groups, Person, PersonAdd } from "@mui/icons-material";
import api from "../config/api";
import { EClientListOrdering } from "../enums/clients";
import type {
  TClient,
  TClientCreate,
  TClientUpdate,
  TClientListRequest,
  TClientListResponse,
} from "../types/clients";

/** Icons */

export const ClientIcons = {
  List: Groups,
  Detail: Person,
  Create: PersonAdd,
};

/** API */

export const clientEndpoints = {
  id: ["clients"] as const,
  url: `${import.meta.env.VITE_BACKEND_BASE_URL}/api/clients/`,
  get: (options?: TClientListRequest) =>
    api
      .get<TClientListResponse>(clientEndpoints.url, options)
      .then((res) => res.data),
  post: (body: TClientCreate) =>
    api.post<TClient>(clientEndpoints.url, body).then((res) => res.data),
  client: (id: TClient["id"]) => ({
    id: [...clientEndpoints.id, "client", id] as const,
    url: `${clientEndpoints.url}${id}/`,
    get: () =>
      api.get<TClient>(clientEndpoints.client(id).url).then((res) => res.data),
    patch: (body: TClientUpdate) =>
      api
        .patch<TClient>(clientEndpoints.client(id).url, body)
        .then((res) => res.data),
    delete: () =>
      api.delete<void>(clientEndpoints.client(id).url).then((res) => res.data),
  }),
};

/** Other */

export const clientListOrderingOptions: TOrderingOption<EClientListOrdering>[] =
  [
    {
      id: "created_at",
      label: "Created",
      value: {
        asc: EClientListOrdering.CreatedAtAsc,
        desc: EClientListOrdering.CreatedAtDesc,
      },
    },
    {
      id: "updated_at",
      label: "Updated",
      value: {
        asc: EClientListOrdering.UpdatedAtAsc,
        desc: EClientListOrdering.UpdatedAtDesc,
      },
    },
    {
      id: "first_name",
      label: "First Name",
      value: {
        asc: EClientListOrdering.FirstNameAsc,
        desc: EClientListOrdering.FirstNameDesc,
      },
    },
    {
      id: "last_name",
      label: "Last Name",
      value: {
        asc: EClientListOrdering.LastNameAsc,
        desc: EClientListOrdering.LastNameDesc,
      },
    },
  ];

export const getPlaceholderClient = (
  data: TWithRequired<Partial<TClient>, "id">,
): TClient => ({
  full_name: "-",
  email: "",
  phone_primary: "",
  place: null,
  first_name: "",
  last_name: "",
  phone_secondary: null,
  work_orders_count: 0,
  documents_count: 0,
  created_at: "",
  updated_at: "",
  ...data,
});
