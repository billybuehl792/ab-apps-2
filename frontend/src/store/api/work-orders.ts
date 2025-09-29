import api from "../config/api";
import { workOrderEndpoints } from "../constants/work-orders";
import type { ApiListResponse } from "../types/api";
import type {
  WorkOrder,
  WorkOrderApiListRequest,
  WorkOrderWriteable,
} from "../types/work-orders";

const list = (params?: WorkOrderApiListRequest) =>
  api.get<ApiListResponse<WorkOrder>>(workOrderEndpoints.workOrders(), {
    params,
  });

const count = (params?: WorkOrderApiListRequest) =>
  api.get<{ count: number }>(workOrderEndpoints.workOrders.count(), { params });

const detail = (id: WorkOrder["id"]) =>
  api.get<WorkOrder>(workOrderEndpoints.workOrders.detail(id));

const create = (body: Omit<WorkOrderWriteable, "id">) =>
  api.post<WorkOrderWriteable>(workOrderEndpoints.workOrders(), body);

const update = ({
  id,
  ...body
}: Partial<WorkOrderWriteable> & { id: WorkOrder["id"] }) =>
  api.patch<WorkOrderWriteable>(workOrderEndpoints.workOrders.detail(id), body);

const _delete = (body: WorkOrder["id"]) =>
  api.delete(workOrderEndpoints.workOrders.detail(body));

export const workOrderApi = {
  list,
  count,
  detail,
  create,
  update,
  delete: _delete,
};
