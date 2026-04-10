import { EUserGroup } from "../enums/account";
import type { TUser } from "../types/account";

const isAdmin = (user: TUser) => {
  const adminGroups = [EUserGroup.AbAdmin, EUserGroup.CompanyAdmin];
  return user.groups.some((group) => adminGroups.includes(group));
};

export const adminUtils = { isAdmin };
