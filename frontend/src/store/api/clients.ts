import api from "../config/api";
import { clientEndpoints } from "../constants/clients";
import type { ListResponse } from "../types/api";
import type {
  Client,
  ClientListRequestParams,
  ClientCreateBody,
  ClientUpdateBody,
  ClientWriteable,
} from "../types/clients";

const list = (params?: ClientListRequestParams) =>
  api.get<ListResponse<Client>>(clientEndpoints.clients(), { params });

const count = (params?: ClientListRequestParams) =>
  api.get<{ count: number }>(clientEndpoints.clients.count(), { params });

const detail = (id: Client["id"]) =>
  api.get<Client>(clientEndpoints.clients.detail(id));

const create = (body: ClientCreateBody) =>
  api.post<ClientWriteable>(clientEndpoints.clients(), body);

const update = ({ id, ...body }: ClientUpdateBody) =>
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
