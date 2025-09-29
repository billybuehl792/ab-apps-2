import { AccountCircle, ManageAccounts } from "@mui/icons-material";

/** Icons */

export const AccountIcons = {
  Detail: AccountCircle,
  Settings: ManageAccounts,
};

/** API */

export const accountEndpoints = {
  account: Object.assign(
    () => `${import.meta.env.VITE_BACKEND_BASE_URL}/api/account/`,
    {
      auth: Object.assign(() => `${accountEndpoints.account()}auth/`, {
        me: () => `${accountEndpoints.account.auth()}me/`,
        changePassword: () =>
          `${accountEndpoints.account.auth()}change-password/`,
        token: Object.assign(() => `${accountEndpoints.account.auth()}token/`, {
          refresh: () => `${accountEndpoints.account.auth.token()}refresh/`,
          revoke: () => `${accountEndpoints.account.auth.token()}revoke/`,
        }),
      }),
      users: Object.assign(() => `${accountEndpoints.account()}users/`, {
        detail: (id: number) => `${accountEndpoints.account.users()}${id}/`,
        count: () => `${accountEndpoints.account.users()}count/`,
      }),
    }
  ),
};
