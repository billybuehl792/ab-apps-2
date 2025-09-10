import api from "../config/api";
import endpoints from "../constants/endpoints";
import type { ApiListResponse } from "../types/api";
import type {
  WorkOrder,
  WorkOrderApiListRequest,
  WriteableWorkOrder,
} from "../types/work-orders";

const list = (params?: WorkOrderApiListRequest) =>
  api.get<ApiListResponse<WorkOrder>>(endpoints.workOrders(), { params });

const detail = (id: WorkOrder["id"]) =>
  api.get<WorkOrder>(endpoints.workOrders.detail(id));

const create = (body: Omit<WriteableWorkOrder, "id">) =>
  api.post<WriteableWorkOrder>(endpoints.workOrders(), body);

const update = ({
  id,
  ...body
}: Partial<WriteableWorkOrder> & { id: WorkOrder["id"] }) =>
  api.patch<WriteableWorkOrder>(endpoints.workOrders.detail(id), body);

const _delete = (body: WorkOrder["id"]) =>
  api.delete(endpoints.workOrders.detail(body));

export const workOrderApi = {
  list,
  detail,
  create,
  update,
  delete: _delete,
};
