import {
  Label,
  NewLabel,
  People,
  Person,
  PersonAdd,
} from "@mui/icons-material";
import api from "../config/api";
import { EContactListOrdering } from "../enums/contacts";
import type {
  TContact,
  TContactCreate,
  TContactUpdate,
  TContactListRequest,
  TContactListResponse,
  TContactTagListRequest,
  TContactTagListResponse,
  TContactTag,
  TContactTagCreateOrUpdate,
} from "../types/contacts";

/** Icons */

export const ContactIcons = {
  List: People,
  Detail: Person,
  Create: PersonAdd,
};

export const ContactTagIcons = {
  List: Label,
  Detail: Label,
  Create: NewLabel,
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
  tags: {
    id: ["contacts", "tags"] as const,
    url: `${import.meta.env.VITE_BACKEND_BASE_URL}/api/contacts/tags/`,
    get: (options?: TContactTagListRequest) =>
      api
        .get<TContactTagListResponse>(contactEndpoints.tags.url, options)
        .then((res) => res.data),
    post: (body: TContactTagCreateOrUpdate) =>
      api
        .post<TContactTag>(contactEndpoints.tags.url, body)
        .then((res) => res.data),
    tag: (id: TContactTag["id"]) => ({
      id: [...contactEndpoints.tags.id, id] as const,
      url: `${contactEndpoints.tags.url}${id}/`,
      get: () =>
        api
          .get<TContactTag>(contactEndpoints.tags.tag(id).url)
          .then((res) => res.data),
      patch: (body: TContactTagCreateOrUpdate) =>
        api
          .patch<TContactTag>(contactEndpoints.tags.tag(id).url, body)
          .then((res) => res.data),
      delete: () =>
        api
          .delete<void>(contactEndpoints.tags.tag(id).url)
          .then((res) => res.data),
    }),
  },
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

export const getPlaceholderContact = (
  data: TWithRequired<Partial<TContact>, "id">,
): TContact => ({
  first_name: "",
  last_name: "",
  email: "",
  phone_primary: "",
  phone_secondary: null,
  place: null,
  documents: [],
  tags: [],
  created_at: "",
  updated_at: "",
  ...data,
});

export const getPlaceholderContactTag = (
  data: TWithRequired<Partial<TContactTag>, "id">,
): TContactTag => ({
  label: "",
  color: null,
  description: null,
  created_at: "",
  updated_at: "",
  ...data,
});
