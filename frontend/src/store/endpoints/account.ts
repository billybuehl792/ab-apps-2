import api from "../config/api";
import type {
  TAccessTokenResponse,
  TCredentials,
  TRequestPasswordResetRequest,
  TResetPasswordRequest,
  TUser,
  TUserCreateRequest,
  TUserListRequest,
  TUserListResponse,
  TUserUpdateRequest,
} from "../types/account";
import type { TDetailResponse } from "../types/api";

export const accountEndpoints = {
  auth: {
    me: {
      get: () => api.get<TUser>("account/auth/me/").then((res) => res.data),
    },
    token: {
      post: (credentials: TCredentials) =>
        api
          .post<TAccessTokenResponse>("account/auth/token/", credentials)
          .then((res) => res.data),
      refresh: {
        post: () =>
          api
            .post<TAccessTokenResponse>("account/auth/token/refresh/")
            .then((res) => res.data),
      },
      revoke: {
        post: () =>
          api
            .post<TAccessTokenResponse>("account/auth/token/revoke/")
            .then((res) => res.data),
      },
    },
    requestPasswordReset: {
      post: (body: TRequestPasswordResetRequest) =>
        api
          .post<TDetailResponse>("account/auth/request-password-reset/", body)
          .then((res) => res.data),
    },
  },
  resetPassword: (options: { encodedUserId: string; token: string }) => ({
    get: () =>
      api
        .get<TDetailResponse>(
          `account/auth/reset-password/${options.encodedUserId}/${options.token}/`,
        )
        .then((res) => res.data),
    post: (body: TResetPasswordRequest) =>
      api
        .post<TDetailResponse>(
          `account/auth/reset-password/${options.encodedUserId}/${options.token}/`,
          body,
        )
        .then((res) => res.data),
  }),
  users: {
    get: (body?: TUserListRequest) =>
      api
        .get<TUserListResponse>("account/users/", body)
        .then((res) => res.data),
    post: (body: TUserCreateRequest) =>
      api.post<TUser>("account/users/", body).then((res) => res.data),
    user: (id: TUser["id"]) => ({
      url: `account/users/${id}/`,
      get: () => api.get<TUser>(`account/users/${id}/`).then((res) => res.data),
      patch: (body: TUserUpdateRequest) =>
        api.patch<TUser>(`account/users/${id}/`, body).then((res) => res.data),
      delete: () =>
        api.delete<void>(`account/users/${id}/`).then((res) => res.data),
    }),
  },
};
