import { EUserGroup } from "../enums/account";
import type { TListRequest } from "./api";

export interface ICredentials {
  username: string;
  password: string;
}

export interface Company {
  id: number;
  label: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface IUser {
  id: number;
  username: string;
  full_name: string;
  first_name: string;
  last_name: string;
  email: string;
  groups: EUserGroup[];
  company: Company;
}

export interface WriteableUser {
  id: number;
  username?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  groups?: EUserGroup[];
  company?: Company;
}

/** API */

export type UserListRequestParams = TListRequest["params"];

export interface AccessTokenApiResponse {
  access: string;
  me: IUser;
}
