import { UserGroup } from "../enums/account";
import type { ApiListRequest } from "./api";
import type { Company } from "./account";

export interface Profile {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  groups: UserGroup[];
  company: Company;
}

export interface WriteableProfile {
  id: number;
  username?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  groups?: UserGroup[];
  company?: Company;
}

/** API */

export type ProfileApiListRequest = ApiListRequest;
