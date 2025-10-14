import { UserGroup } from "../enums/account";
import type { ListRequestParams } from "./api";

export interface Credentials {
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

export interface User {
  id: number;
  username: string;
  full_name: string;
  first_name: string;
  last_name: string;
  email: string;
  groups: UserGroup[];
  company: Company;
}

export interface WriteableUser {
  id: number;
  username?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  groups?: UserGroup[];
  company?: Company;
}

/** API */

export type UserListRequestParams = ListRequestParams;

export interface AccessTokenApiResponse {
  access: string;
  me: User;
}
