import api from "../config/api";
import endpoints from "../constants/endpoints";
import type { ApiListResponse } from "../types/api";
import type {
  WorkOrder,
  WorkOrderApiListRequest,
  WorkOrderWriteable,
} from "../types/work-orders";

const list = (params?: WorkOrderApiListRequest) =>
  api.get<ApiListResponse<WorkOrder>>(endpoints.workOrders(), { params });

const count = (params?: WorkOrderApiListRequest) =>
  api.get<{ count: number }>(endpoints.workOrders.count(), { params });

const detail = (id: WorkOrder["id"]) =>
  api.get<WorkOrder>(endpoints.workOrders.detail(id));

const create = (body: Omit<WorkOrderWriteable, "id">) =>
  api.post<WorkOrderWriteable>(endpoints.workOrders(), body);

const update = ({
  id,
  ...body
}: Partial<WorkOrderWriteable> & { id: WorkOrder["id"] }) =>
  api.patch<WorkOrderWriteable>(endpoints.workOrders.detail(id), body);

const _delete = (body: WorkOrder["id"]) =>
  api.delete(endpoints.workOrders.detail(body));

export const workOrderApi = {
  list,
  count,
  detail,
  create,
  update,
  delete: _delete,
};
