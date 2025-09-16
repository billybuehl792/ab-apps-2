import { ClientApiListRequestOrdering } from "../enums/clients";
import { WorkOrderStatus } from "../enums/work-orders";
import type { ApiListRequest } from "./api";
import type { Place } from "./places";
import type { WorkOrder } from "./work-orders";

export interface Client {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_primary: string;
  phone_secondary: string | null;
  place: Place | null;
  work_orders: WorkOrder[];
  created_at: string;
  updated_at: string;
}

export interface WriteableClient {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_primary: string;
  phone_secondary?: string | null;
  work_orders?: WorkOrder["id"][];
  place: Place["id"] | Place["google_place_id"] | null;
}

/** API */

type ClientApiListRequestFilters = {
  work_orders__status?: WorkOrderStatus[];
  place__city?: string[];
};

export type ClientApiListRequest =
  ApiListRequest<ClientApiListRequestOrdering> & ClientApiListRequestFilters;
