import api from "../config/api";
import endpoints from "../constants/endpoints";
import type { ApiListRequest, ApiListResponse } from "../types/api";
import type { Client } from "../types";

const list = (
  params?: ApiListRequest<
    "created_at" | "first_name" | "last_name",
    "email" | "first_name" | "last_name"
  >
) =>
  api.get<ApiListResponse<Client>>(endpoints.clients(), {
    params,
  });

const detail = (id: Client["id"]) =>
  api.get<Client>(endpoints.clients.detail(id));

export const clientApi = {
  list,
  detail,
};
