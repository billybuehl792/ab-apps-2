import {
  WorkOrderApiListRequestOrdering,
  WorkOrderStatus,
} from "../enums/work-orders";
import type { ApiListRequest } from "./api";
import type { ClientBasic } from "./clients";
import type { PlaceBasic } from "./places";

export interface WorkOrder {
  id: number;
  label: string;
  description: string;
  status: WorkOrderStatus;
  scheduled_date: string | null;
  completed_date: string | null;
  cost: string;
  client: ClientBasic | null;
  place: PlaceBasic | null;
  created_at: string;
  updated_at: string;
}

export interface WorkOrderBasic {
  id: number;
  label: string;
  status: WorkOrderStatus;
}

export interface WorkOrderWriteable {
  id: number;
  label: string;
  description: string;
  status: WorkOrderStatus;
  scheduled_date: string | null;
  completed_date: string | null;
  cost: number;
  client: number | null;
  place: number | string | null;
}

/** API */

type WorkOrderApiListRequestFilters = {
  status?: WorkOrderStatus[];
  client?: number[];
  place__city?: string[];
};

export type WorkOrderApiListRequest =
  ApiListRequest<WorkOrderApiListRequestOrdering> &
    WorkOrderApiListRequestFilters;
