import api from "../config/api";
import endpoints from "../constants/endpoints";
import type { ApiListResponse } from "../types/api";
import type {
  Client,
  ClientApiListRequest,
  WriteableClient,
} from "../types/clients";

const list = (params?: ClientApiListRequest) =>
  api.get<ApiListResponse<Client>>(endpoints.clients(), { params });

const count = (params?: ClientApiListRequest) =>
  api.get<{ count: number }>(endpoints.clients.count(), { params });

const detail = (id: Client["id"]) =>
  api.get<Client>(endpoints.clients.detail(id));

const create = (body: Omit<WriteableClient, "id">) =>
  api.post<WriteableClient>(endpoints.clients(), body);

const update = ({ id, ...body }: WriteableClient) =>
  api.patch<WriteableClient>(endpoints.clients.detail(id), body);

const _delete = (body: Client["id"]) =>
  api.delete(endpoints.clients.detail(body));

export const clientApi = {
  list,
  count,
  detail,
  create,
  update,
  delete: _delete,
};
