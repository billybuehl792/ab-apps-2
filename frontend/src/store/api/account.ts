import api from "../config/api";
import endpoints from "../constants/endpoints";
import type { ApiListResponse } from "../types/api";
import type { User, UserApiListRequest } from "../types/account";

const me = () => api.get<User>(endpoints.account.me());

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

export const accountApi = { me, users };
