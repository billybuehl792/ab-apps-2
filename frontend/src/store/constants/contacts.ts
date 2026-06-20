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
import type { TDocument, TDocumentCreate } from "../types/documents";

/** Icons */

export const ContactIcons = {
  List: People,
  Detail: Person,
  Create: PersonAdd,
};

/** API */

export const contactEndpoints = {
  id: ["contacts"] as const,
  url: "/contacts/",
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
    uploadDocument: (body: TDocumentCreate) => {
      const formData = new FormData();
      formData.append("file", body.file);
      if (body.label) formData.append("label", body.label);
      if (body.description) formData.append("description", body.description);
      return api
        .post<TDocument>(`/contacts/${id}/documents/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((res) => res.data);
    },
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
