import api from "../config/api";
import { accountEndpoints } from "../constants/account";
import type { TListResponse } from "../types/api";
import type {
  AccessTokenApiResponse,
  ICredentials,
  IUser,
  UserListRequestParams,
} from "../types/account";

/** Auth */

const token = (credentials: ICredentials) =>
  api.post<AccessTokenApiResponse>(
    accountEndpoints.account.auth.token(),
    credentials,
  );

const tokenRefresh = () =>
  api.post<AccessTokenApiResponse>(
    accountEndpoints.account.auth.token.refresh(),
  );

const tokenRevoke = () =>
  api.post<{ detail: string }>(accountEndpoints.account.auth.token.revoke());

const me = () => api.get<IUser>(accountEndpoints.account.auth.me());

/** Users */

const list = (params?: UserListRequestParams) =>
  api.get<TListResponse<IUser>>(accountEndpoints.account.users(), { params });

const count = (params?: UserListRequestParams) =>
  api.get<TListResponse<IUser>>(accountEndpoints.account.users.count(), {
    params,
  });

const detail = (id: IUser["id"]) =>
  api.get<IUser>(accountEndpoints.account.users.detail(id));

export const accountApi = {
  auth: { token, tokenRefresh, tokenRevoke, me },
  users: { list, count, detail },
};
