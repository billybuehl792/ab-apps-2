import { mutationOptions } from "@tanstack/react-query";
import documentEndpoints from "../endpoints/documents";
import { compressImage } from "../utils/image";
import type { TDocument, TDocumentCreate } from "../types/documents";

export const documentMutations = {
  create: mutationOptions({
    mutationKey: ["documents", "create"] as const,
    mutationFn: async (body: TDocumentCreate) => {
      const compressedFile = await compressImage(body.file);
      return documentEndpoints.post({ ...body, file: compressedFile });
    },
  }),
  delete: mutationOptions({
    mutationKey: ["documents", "delete"] as const,
    mutationFn: (id: TDocument["id"]) =>
      documentEndpoints.document(id).delete(),
  }),
  document: (id: TDocument["id"]) => ({
    update: mutationOptions({
      mutationKey: ["documents", "document", "update", id] as const,
      mutationFn: documentEndpoints.document(id).patch,
    }),
    delete: mutationOptions({
      mutationKey: ["documents", "document", "delete", id] as const,
      mutationFn: documentEndpoints.document(id).delete,
    }),
  }),
};
