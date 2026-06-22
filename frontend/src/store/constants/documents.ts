import { FileCopy, InsertDriveFile, UploadFile } from "@mui/icons-material";

import api from "../config/api";
import type {
  TDocument,
  TDocumentCreate,
  TDocumentUpdate,
} from "../types/documents";

/** Icons */

export const DocumentIcons = {
  List: FileCopy,
  Detail: InsertDriveFile,
  Create: UploadFile,
};

/** API */

export const documentEndpoints = {
  id: ["documents"] as const,
  url: "/documents/",
  post: (body: TDocumentCreate) => {
    const formData = new FormData();
    formData.append("file", body.file);
    if (body.label) formData.append("label", body.label);
    if (body.description) formData.append("description", body.description);
    return api
      .post<TDocument>(documentEndpoints.url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => res.data);
  },
  document: (id: TDocument["id"]) => ({
    id: [...documentEndpoints.id, "document", id] as const,
    url: `${documentEndpoints.url}${id}/`,
    get: () =>
      api
        .get<TDocument>(documentEndpoints.document(id).url)
        .then((res) => res.data),
    patch: (body: TDocumentUpdate) =>
      api
        .patch<TDocument>(documentEndpoints.document(id).url, body)
        .then((res) => res.data),
    delete: () =>
      api
        .delete<void>(documentEndpoints.document(id).url)
        .then((res) => res.data),
  }),
};
