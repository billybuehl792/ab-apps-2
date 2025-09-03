import api from "../config/api";
import endpoints from "../constants/endpoints";
import type { ApiListRequest, ApiListResponse } from "../types/api";
import type { Client } from "../types";

const list = (
  params?: ApiListRequest<"first_name" | "last_name"> & { has_email?: 1 }
) =>
  api.get<ApiListResponse<Client>>(endpoints.clients(), {
    params,
  });

const detail = (id: Client["id"]) =>
  api.get<Client>(endpoints.clients.detail(id));

const create = (body: Omit<Client, "id">) =>
  api.post<Client>(endpoints.clients(), body);

const update = (body: Pick<Client, "id"> & Partial<Omit<Client, "id">>) =>
  api.patch<Client>(endpoints.clients.detail(body.id), body);

const _delete = (body: Client["id"]) =>
  api.delete(endpoints.clients.detail(body));

export const clientApi = {
  list,
  detail,
  create,
  update,
  delete: _delete,
};
