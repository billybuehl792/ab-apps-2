export interface Credentials {
  username: string;
  password: string;
}

interface ObjectBase {
  id: string;
  created_at: string;
  updated_at: string;
}

export interface Company extends ObjectBase {
  label: string;
  description: string;
}

export interface User extends ObjectBase {
  username: string;
  email: string;
  role: "user" | "admin" | "super_admin";
  company: Company | null;
}

export interface Place extends ObjectBase {
  address: string;
  place_id: string;
}

export interface Client extends ObjectBase {
  first_name: string;
  last_name: string;
  email: string;
  phone_primary: string;
  phone_secondary: string;
  place_id: Place["id"] | null;
  place: Place | null;
  work_orders: WorkOrder[];
}

export interface WorkOrder extends ObjectBase {
  label: string;
  description: string;
  status: "new" | "in_progress" | "completed" | "canceled";
  scheduled_date: string | null;
  completed_date: string | null;
  cost: number;
  client: Client;
  place_id: Place["id"];
  place: Place;
}
