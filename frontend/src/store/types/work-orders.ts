import z from "zod";
import { workOrderListParamsSchema } from "../schemas/work-orders";
import { WorkOrderStatus } from "../enums/work-orders";
import type { ClientBasic } from "./clients";
import type { PlaceBasic, PlaceWriteable } from "./places";

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
  place?: PlaceWriteable | null;
}

/** API */

export type WorkOrderCreateBody = Omit<WorkOrderWriteable, "id">;

export type WorkOrderUpdateBody = Partial<WorkOrderCreateBody> & { id: number };

export type WorkOrderListRequestParams = z.output<
  typeof workOrderListParamsSchema
>;
