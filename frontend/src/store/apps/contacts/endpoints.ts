import api from "@/store/config/api";
import type {
  TContactCreate,
  TContactListRequest,
  TContactListResponse,
} from "./types";
import type { TContact } from "./contact/types";

const contactsEndpoints = {
  get: (options?: TContactListRequest) =>
    api.get<TContactListResponse>("/contacts/", options),
  post: (body: TContactCreate) => api.post<TContact>("/contacts/", body),
};

export default contactsEndpoints;
