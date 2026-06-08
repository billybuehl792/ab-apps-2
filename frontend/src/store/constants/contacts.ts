import { People, Person, PersonAdd } from "@mui/icons-material";
import api from "../config/api";
import { EContactListOrdering } from "../enums/contacts";
import type {
  TContact,
  TContactCreate,
  TContactUpdate,
  TContactListRequest,
  TContactListResponse,
} from "../types/contacts";

/** Icons */

export const ContactIcons = {
  List: People,
  Detail: Person,
  Create: PersonAdd,
};

/** API */

export const contactEndpoints = {
  id: ["contacts"] as const,
  url: `${import.meta.env.VITE_BACKEND_BASE_URL}/api/contacts/`,
  get: (options?: TContactListRequest) =>
    api
      .get<TContactListResponse>(contactEndpoints.url, options)
      .then((res) => res.data),
  post: (body: TContactCreate) =>
    api.post<TContact>(contactEndpoints.url, body).then((res) => res.data),
  contact: (id: TContact["id"]) => ({
    id: [...contactEndpoints.id, "contact", id] as const,
    url: `${contactEndpoints.url}${id}/`,
    get: () =>
      api
        .get<TContact>(contactEndpoints.contact(id).url)
        .then((res) => res.data),
    patch: (body: TContactUpdate) =>
      api
        .patch<TContact>(contactEndpoints.contact(id).url, body)
        .then((res) => res.data),
    delete: () =>
      api
        .delete<void>(contactEndpoints.contact(id).url)
        .then((res) => res.data),
  }),
};

/** Other */

export const contactListOrderingOptions: TOrderingOption<EContactListOrdering>[] =
  [
    {
      id: "first_name",
      label: "First Name",
      value: {
        asc: EContactListOrdering.FirstNameAsc,
        desc: EContactListOrdering.FirstNameDesc,
      },
    },
    {
      id: "last_name",
      label: "Last Name",
      value: {
        asc: EContactListOrdering.LastNameAsc,
        desc: EContactListOrdering.LastNameDesc,
      },
    },
    {
      id: "created_at",
      label: "Created",
      value: {
        asc: EContactListOrdering.CreatedAtAsc,
        desc: EContactListOrdering.CreatedAtDesc,
      },
    },
    {
      id: "updated_at",
      label: "Updated",
      value: {
        asc: EContactListOrdering.UpdatedAtAsc,
        desc: EContactListOrdering.UpdatedAtDesc,
      },
    },
  ];
