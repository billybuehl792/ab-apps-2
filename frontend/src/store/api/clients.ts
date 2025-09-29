import api from "../config/api";
import { clientEndpoints } from "../constants/clients";
import type { ApiListResponse } from "../types/api";
import type {
  Client,
  ClientApiListRequest,
  ClientWriteable,
} from "../types/clients";

const list = (params?: ClientApiListRequest) =>
  api.get<ApiListResponse<Client>>(clientEndpoints.clients(), { params });

const count = (params?: ClientApiListRequest) =>
  api.get<{ count: number }>(clientEndpoints.clients.count(), { params });

const detail = (id: Client["id"]) =>
  api.get<Client>(clientEndpoints.clients.detail(id));

const create = (body: Omit<ClientWriteable, "id">) =>
  api.post<ClientWriteable>(clientEndpoints.clients(), body);

const update = ({ id, ...body }: ClientWriteable) =>
  api.patch<ClientWriteable>(clientEndpoints.clients.detail(id), body);

const _delete = (body: Client["id"]) =>
  api.delete(clientEndpoints.clients.detail(body));

export const clientApi = {
  list,
  count,
  detail,
  create,
  update,
  delete: _delete,
};
