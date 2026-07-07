import { queryOptions } from "@tanstack/react-query";
import contactEndpoints from "../endpoints/contacts";
import type {
  TContact,
  TContactDocumentListRequest,
  TContactHistoryListRequest,
  TContactListRequest,
} from "../types/contacts";
import type { TDocument } from "../types/documents";

export const contactQueries = {
  list: (body?: TContactListRequest) =>
    queryOptions({
      queryKey: ["contacts", "list", body],
      queryFn: () => contactEndpoints.get(body),
    }),
  contact: (id: TContact["id"]) => ({
    detail: queryOptions({
      queryKey: ["contacts", "contact", id],
      queryFn: contactEndpoints.contact(id).get,
    }),
    documents: {
      list: (body: TContactDocumentListRequest) =>
        queryOptions({
          queryKey: ["contacts", "contact", id, "documents", "list", body],
          queryFn: () => contactEndpoints.contact(id).documents.get(body),
        }),
      document: (dId: TDocument["id"]) => ({
        detail: queryOptions({
          queryKey: ["contacts", "contact", id, "documents", dId],
          queryFn: () =>
            contactEndpoints.contact(id).documents.document(dId).get(),
        }),
      }),
    },
    history: {
      list: (body: TContactHistoryListRequest) =>
        queryOptions({
          queryKey: ["contacts", "contact", id, "history", "list", body],
          queryFn: () => contactEndpoints.contact(id).history.get(body),
        }),
    },
  }),
};
