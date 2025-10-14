import api from "../config/api";
import { accountEndpoints } from "../constants/account";
import type { ListResponse } from "../types/api";
import type {
  AccessTokenApiResponse,
  Credentials,
  User,
  UserListRequestParams,
} from "../types/account";

/** Auth */

const token = (credentials: Credentials) =>
  api.post<AccessTokenApiResponse>(
    accountEndpoints.account.auth.token(),
    credentials
  );

const tokenRefresh = () =>
  api.post<AccessTokenApiResponse>(
    accountEndpoints.account.auth.token.refresh()
  );

const tokenRevoke = () =>
  api.post<{ detail: string }>(accountEndpoints.account.auth.token.revoke());

const me = () => api.get<User>(accountEndpoints.account.auth.me());

/** Users */

const list = (params?: UserListRequestParams) =>
  api.get<ListResponse<User>>(accountEndpoints.account.users(), { params });

const count = (params?: UserListRequestParams) =>
  api.get<ListResponse<User>>(accountEndpoints.account.users.count(), {
    params,
  });

const detail = (id: User["id"]) =>
  api.get<User>(accountEndpoints.account.users.detail(id));

export const accountApi = {
  auth: { token, tokenRefresh, tokenRevoke, me },
  users: { list, count, detail },
};
