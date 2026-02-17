import api from "../config/api";
import { clientEndpoints } from "../constants/clients";
import type {
  TClient,
  TClientCreateBody,
  TClientListRequest,
  TClientListResponse,
  TClientUpdateBody,
  TClientWriteable,
} from "../types/clients";

const list = (options?: TClientListRequest) =>
  api.get<TClientListResponse>(clientEndpoints.clients(), options);

const count = (options?: TClientListRequest) =>
  api.get<Pick<TClientListResponse, "count">>(
    clientEndpoints.clients.count(),
    options,
  );

const detail = (id: TClient["id"]) =>
  api.get<TClient>(clientEndpoints.clients.detail(id));

const create = (body: TClientCreateBody) =>
  api.post<TClientWriteable>(clientEndpoints.clients(), body);

const update = ({ id, ...body }: TClientUpdateBody) =>
  api.patch<TClientWriteable>(clientEndpoints.clients.detail(id), body);

const _delete = (body: TClient["id"]) =>
  api.delete(clientEndpoints.clients.detail(body));

export const clientApi = {
  list,
  count,
  detail,
  create,
  update,
  delete: _delete,
};
