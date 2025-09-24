import api from "../config/api";
import endpoints from "../constants/endpoints";
import type { ApiListResponse } from "../types/api";
import type {
  AccessTokenApiResponse,
  Credentials,
  User,
  UserApiListRequest,
} from "../types/account";

/** Auth */

const token = (credentials: Credentials) =>
  api.post<AccessTokenApiResponse>(endpoints.account.token(), credentials);

const tokenRefresh = () =>
  api.post<AccessTokenApiResponse>(endpoints.account.token.refresh());

const tokenRevoke = () =>
  api.post<{ detail: string }>(endpoints.account.token.revoke());

const me = () => api.get<User>(endpoints.account.me());

/** Users */

const list = (params?: UserApiListRequest) =>
  api.get<ApiListResponse<User>>(endpoints.account.users(), { params });

const count = (params?: UserApiListRequest) =>
  api.get<ApiListResponse<User>>(endpoints.account.users.count(), { params });

const detail = (id: User["id"]) =>
  api.get<User>(endpoints.account.users.detail(id));

const users = {
  list,
  count,
  detail,
};

export const accountApi = {
  token,
  tokenRefresh,
  tokenRevoke,
  me,
  users,
};
