import { queryOptions } from "@tanstack/react-query";
import documentEndpoints from "../endpoints/documents";
import type { TDocument, TDocumentListRequest } from "../types/documents";

export const documentQueries = {
  list: (body?: TDocumentListRequest) =>
    queryOptions({
      queryKey: ["documents", "list", body] as const,
      queryFn: () => documentEndpoints.get(body),
    }),
  document: (id: TDocument["id"]) => ({
    detail: queryOptions({
      queryKey: ["documents", "document", id] as const,
      queryFn: documentEndpoints.document(id).get,
    }),
  }),
};
