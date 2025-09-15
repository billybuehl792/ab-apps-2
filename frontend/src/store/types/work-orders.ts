import {
  WorkOrderApiListRequestOrdering,
  WorkOrderStatus,
} from "../enums/work-orders";
import type { ApiListRequest } from "./api";
import type { Client } from "./clients";
import type { Place } from "./places";

export interface WorkOrder {
  id: number;
  label: string;
  description: string;
  status: WorkOrderStatus;
  scheduled_date: string | null;
  completed_date: string | null;
  cost: string;
  client: Client | null;
  place: Place | null;
  created_at: string;
  updated_at: string;
}

export interface WriteableWorkOrder {
  id: number;
  label: string;
  description: string;
  status: WorkOrderStatus;
  scheduled_date: string | null;
  completed_date: string | null;
  cost: number;
  client: Client["id"] | null;
  place: Place["id"] | Place["google_place_id"] | null;
}

/** API */

type WorkOrderApiListRequestFilters = {
  status?: WorkOrderStatus[];
  client?: Client["id"][];
};

export type WorkOrderApiListRequest =
  ApiListRequest<WorkOrderApiListRequestOrdering> &
    WorkOrderApiListRequestFilters;
