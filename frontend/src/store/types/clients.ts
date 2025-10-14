import { ClientListRequestParamsOrdering } from "../enums/clients";
import { WorkOrderStatus } from "../enums/work-orders";
import type { ListRequestParams } from "./api";
import type { Place, PlaceBasic } from "./places";

export interface Client {
  id: number;
  full_name: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_primary: string;
  phone_secondary: string | null;
  place: Place | null;
  work_orders_count: number;
  documents_count: number;
  created_at: string;
  updated_at: string;
}

export interface ClientDetail {
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

export interface ClientCreateBody {
  first_name: string;
  last_name: string;
  email: string;
  phone_primary: string;
  phone_secondary?: string | null;
  place?: string | null;
  work_orders?: number[];
  documents?: number[];
}

export interface ClientUpdateBody {
  id: number;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_primary?: string;
  phone_secondary?: string | null;
  place?: string | null;
}

type ClientListRequestParamsFilters = {
  work_orders__status?: WorkOrderStatus[];
  place__city?: string[];
};

export type ClientListRequestParams =
  ListRequestParams<ClientListRequestParamsOrdering> &
    ClientListRequestParamsFilters;
