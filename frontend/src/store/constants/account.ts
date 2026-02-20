import { AccountCircle, ManageAccounts } from "@mui/icons-material";
import api from "../config/api";
import { EUserListOrdering } from "../enums/account";
import type {
  TAccessTokenResponse,
  TResetPasswordRequest,
  TCredentials,
  TSendPasswordResetEmailRequest,
  TUser,
  TUserCreate,
  TUserListRequest,
  TUserListResponse,
  TUserUpdate,
} from "../types/account";

/** Icons */

export const AccountIcons = {
  Detail: AccountCircle,
  Settings: ManageAccounts,
};

/** API */

export const accountEndpoints = {
  id: ["account"] as const,
  url: `${import.meta.env.VITE_BACKEND_BASE_URL}/api/account/`,
  auth: () => ({
    id: [...accountEndpoints.id, "auth"] as const,
    url: `${accountEndpoints.url}auth/`,
    token: () => ({
      id: [...accountEndpoints.auth().id, "token"] as const,
      url: `${accountEndpoints.auth().url}token/`,
      post: (credentials: TCredentials) =>
        api
          .post<TAccessTokenResponse>(
            accountEndpoints.auth().token().url,
            credentials,
          )
          .then((res) => res.data),
      refresh: () => ({
        id: [...accountEndpoints.auth().token().id, "refresh"] as const,
        url: `${accountEndpoints.auth().token().url}refresh/`,
        post: () =>
          api
            .post<TAccessTokenResponse>(
              accountEndpoints.auth().token().refresh().url,
            )
            .then((res) => res.data),
      }),
      revoke: () => ({
        id: [...accountEndpoints.auth().token().id, "revoke"] as const,
        url: `${accountEndpoints.auth().token().url}revoke/`,
        post: () =>
          api
            .post<TAccessTokenResponse>(
              accountEndpoints.auth().token().revoke().url,
            )
            .then((res) => res.data),
      }),
    }),
    me: () => ({
      id: [...accountEndpoints.auth().id, "me"] as const,
      url: `${accountEndpoints.auth().url}me/`,
      get: () =>
        api
          .get<TUser>(accountEndpoints.auth().me().url)
          .then((res) => res.data),
    }),
    sendPasswordResetEmail: () => ({
      id: [...accountEndpoints.auth().id, "send-password-reset-email"] as const,
      url: `${accountEndpoints.auth().url}send-password-reset-email/`,
      post: (body: TSendPasswordResetEmailRequest) =>
        api
          .post(accountEndpoints.auth().sendPasswordResetEmail().url, body)
          .then((res) => res.data),
    }),
    resetPassword: () => ({
      id: [...accountEndpoints.auth().id, "reset-password"] as const,
      url: `${accountEndpoints.auth().url}reset-password/`,
      patch: (body: TResetPasswordRequest) =>
        api.patch(accountEndpoints.auth().resetPassword().url, body),
    }),
  }),
  users: () => ({
    id: [...accountEndpoints.id, "users"] as const,
    url: `${accountEndpoints.url}users/`,
    get: (options?: TUserListRequest) =>
      api
        .get<TUserListResponse>(accountEndpoints.users().url, options)
        .then((res) => res.data),
    post: (body: TUserCreate) =>
      api
        .post<TUser>(accountEndpoints.users().url, body)
        .then((res) => res.data),
    user: (id: TUser["id"]) => ({
      id: [...accountEndpoints.users().id, "detail", id] as const,
      url: `${accountEndpoints.users().url}${id}/`,
      get: () =>
        api
          .get<TUser>(accountEndpoints.users().user(id).url)
          .then((res) => res.data),
      patch: (body: TUserUpdate) =>
        api
          .patch<TUser>(accountEndpoints.users().user(id).url, body)
          .then((res) => res.data),
      delete: () =>
        api
          .delete<void>(accountEndpoints.users().user(id).url)
          .then((res) => res.data),
    }),
  }),
};

export const authEndpoints = accountEndpoints.auth();
export const tokenEndpoints = accountEndpoints.auth().token();
export const userEndpoints = accountEndpoints.users();

/** Other */

export const userListOrderingOptions: TOrderingOption<EUserListOrdering>[] = [
  {
    id: "created_at",
    label: "Created",
    value: {
      asc: EUserListOrdering.CreatedAtAsc,
      desc: EUserListOrdering.CreatedAtDesc,
    },
  },
  {
    id: "updated_at",
    label: "Updated",
    value: {
      asc: EUserListOrdering.UpdatedAtAsc,
      desc: EUserListOrdering.UpdatedAtDesc,
    },
  },
  {
    id: "first_name",
    label: "First Name",
    value: {
      asc: EUserListOrdering.FirstNameAsc,
      desc: EUserListOrdering.FirstNameDesc,
    },
  },
  {
    id: "last_name",
    label: "Last Name",
    value: {
      asc: EUserListOrdering.LastNameAsc,
      desc: EUserListOrdering.LastNameDesc,
    },
  },
];
