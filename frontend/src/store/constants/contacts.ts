import { People, Person, PersonAdd } from "@mui/icons-material";
import api from "../config/api";
import { EContactListOrdering } from "../enums/contacts";
import type {
  TContact,
  TContactCreate,
  TContactUpdate,
  TContactListRequest,
  TContactListResponse,
  TContactDocumentListRequest,
  TContactDocumentListResponse,
} from "../types/contacts";
import type {
  TDocument,
  TDocumentCreate,
  TDocumentUpdate,
} from "../types/documents";

/** Icons */

export const ContactIcons = {
  List: People,
  Detail: Person,
  Create: PersonAdd,
};

/** API */

export const contactEndpoints = {
  id: ["contacts"] as const,
  get: (options?: TContactListRequest) =>
    api
      .get<TContactListResponse>(`/contacts/`, options)
      .then(({ data }) => data),
  post: (body: TContactCreate) =>
    api.post<TContact>(`/contacts/`, body).then(({ data }) => data),
  contact: (id: TContact["id"]) => ({
    id: ["contacts", "contact", id] as const,
    get: () => api.get<TContact>(`/contacts/${id}/`).then(({ data }) => data),
    patch: (body: TContactUpdate) =>
      api.patch<TContact>(`/contacts/${id}/`, body).then(({ data }) => data),
    delete: () => api.delete<void>(`/contacts/${id}/`).then(({ data }) => data),
    documents: () => ({
      id: ["contacts", "contact", id, "documents"] as const,
      get: (options?: TContactDocumentListRequest) =>
        api
          .get<TContactDocumentListResponse>(
            `/contacts/${id}/documents/`,
            options,
          )
          .then(({ data }) => data),
      post: (body: TDocumentCreate) => {
        const formData = new FormData();
        formData.append("file", body.file);
        formData.append("label", body.label);
        if (body.description) formData.append("description", body.description);
        return api
          .post<TDocument>(`/contacts/${id}/documents/`, formData)
          .then(({ data }) => data);
      },
      document: (documentId: TDocument["id"]) => ({
        id: ["contacts", "contact", id, "documents", documentId] as const,
        get: () =>
          api
            .get<TDocument>(`/contacts/${id}/documents/${documentId}/`)
            .then(({ data }) => data),
        patch: (body: TDocumentUpdate) =>
          api
            .patch<TDocument>(`/contacts/${id}/documents/${documentId}/`, body)
            .then(({ data }) => data),
        delete: () =>
          api
            .delete<void>(`/contacts/${id}/documents/${documentId}/`)
            .then(({ data }) => data),
      }),
    }),
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
