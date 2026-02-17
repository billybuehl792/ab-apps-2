import { EUserGroup } from "../enums/account";
import type { IUser } from "../types/account";

const isAdmin = (user: IUser) => {
  const adminGroups = [EUserGroup.AbAdmin, EUserGroup.CompanyAdmin];
  return user.groups.some((group) => adminGroups.includes(group));
};

export const adminUtils = { isAdmin };
