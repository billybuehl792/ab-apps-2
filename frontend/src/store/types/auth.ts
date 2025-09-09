import { UserGroup } from "../enums/auth";

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
  first_name: string;
  last_name: string;
  email: string;
  groups: UserGroup[];
  company: Company;
}
