export interface Credentials {
  username: string;
  password: string;
}

export interface Company {
  id: string;
  label: string;
  description: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: "user" | "admin" | "super_admin";
  company: Company | null;
}

export interface Place {
  id: string;
  address: string;
  place_id: string;
}

export interface Client {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_primary: string;
  phone_secondary: string;
  place: Place | null;
}
