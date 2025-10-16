import { ClientListRequestParamsOrdering } from "../enums/clients";
import { WorkOrderStatus } from "../enums/work-orders";
import type { ListRequestParams } from "./api";
import type { PlaceBasic, PlaceWriteable } from "./places";

export interface Client {
  id: number;
  full_name: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_primary: string;
  phone_secondary: string | null;
  place: PlaceBasic | null;
  work_orders_count: number;
  documents_count: number;
  created_at: string;
  updated_at: string;
}

export interface ClientBasic {
  id: number;
  full_name: string;
  email: string;
  phone_primary: string;
  place: PlaceBasic | null;
}

export interface ClientWriteable {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  phone_primary: string;
  phone_secondary?: string | null;
  place?: PlaceWriteable | null;
}

/** API */

export type ClientCreateBody = Omit<ClientWriteable, "id" | "full_name">;

export type ClientUpdateBody = Partial<ClientCreateBody> & { id: number };

export type ClientListRequestParams =
  ListRequestParams<ClientListRequestParamsOrdering> & {
    work_orders__status?: WorkOrderStatus[];
    place__city?: string[];
  };
