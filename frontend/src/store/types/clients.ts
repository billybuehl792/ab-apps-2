import { ClientApiListRequestOrdering } from "../enums/clients";
import { WorkOrderStatus } from "../enums/work-orders";
import type { ApiListRequest } from "./api";
import type { PlaceBasic } from "./places";
import type { WorkOrderBasic } from "./work-orders";

export interface Client {
  id: number;
  full_name: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_primary: string;
  phone_secondary: string | null;
  place: PlaceBasic | null;
  work_orders: WorkOrderBasic[];
  created_at: string;
  updated_at: string;
}

export interface ClientBasic {
  id: number;
  full_name: string;
  email: string;
  phone_primary: string;
}

export interface ClientWriteable {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_primary: string;
  phone_secondary?: string | null;
  place: number | string | null;
}

/** API */

type ClientApiListRequestFilters = {
  work_orders__status?: WorkOrderStatus[];
  place__city?: string[];
};

export type ClientApiListRequest =
  ApiListRequest<ClientApiListRequestOrdering> & ClientApiListRequestFilters;
