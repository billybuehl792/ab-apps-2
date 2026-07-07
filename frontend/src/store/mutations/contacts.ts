import { mutationOptions } from "@tanstack/react-query";
import contactEndpoints from "../endpoints/contacts";
import type { TContact } from "../types/contacts";
import type { TDocument } from "../types/documents";

export const contactMutations = {
  create: mutationOptions({
    mutationKey: ["contacts", "create"] as const,
    mutationFn: contactEndpoints.post,
  }),
  delete: mutationOptions({
    mutationKey: ["contacts", "contact", "delete"] as const,
    mutationFn: (id: TContact["id"]) => contactEndpoints.contact(id).delete(),
  }),
  contact: (id: TContact["id"]) => ({
    update: mutationOptions({
      mutationKey: ["contacts", "contact", "update", id] as const,
      mutationFn: contactEndpoints.contact(id).patch,
    }),
    delete: mutationOptions({
      mutationKey: ["contacts", "contact", "delete", id] as const,
      mutationFn: contactEndpoints.contact(id).delete,
    }),
    documents: {
      create: mutationOptions({
        mutationKey: [
          "contacts",
          "contact",
          id,
          "documents",
          "create",
        ] as const,
        mutationFn: contactEndpoints.contact(id).documents.post,
      }),
      delete: mutationOptions({
        mutationKey: [
          "contacts",
          "contact",
          id,
          "documents",
          "delete",
        ] as const,
        mutationFn: (dId: TContact["id"]) =>
          contactEndpoints.contact(id).documents.document(dId).delete(),
      }),
      document: (dId: TDocument["id"]) => ({
        update: mutationOptions({
          mutationKey: [
            "contacts",
            "contact",
            id,
            "documents",
            "update",
            dId,
          ] as const,
          mutationFn: contactEndpoints.contact(id).documents.document(dId)
            .patch,
        }),
        delete: mutationOptions({
          mutationKey: [
            "contacts",
            "contact",
            id,
            "documents",
            "delete",
            dId,
          ] as const,
          mutationFn: contactEndpoints.contact(id).documents.document(dId)
            .delete,
        }),
      }),
    },
  }),
};
