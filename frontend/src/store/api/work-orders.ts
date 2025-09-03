import api from "../config/api";
import endpoints from "../constants/endpoints";
import type { ApiListRequest, ApiListResponse } from "../types/api";
import type { WorkOrder } from "../types";

const list = (
  params?: ApiListRequest<"created_at" | "first_name" | "last_name">
) =>
  api.get<ApiListResponse<WorkOrder>>(endpoints.workOrders(), {
    params,
  });

const detail = (id: WorkOrder["id"]) =>
  api.get<WorkOrder>(endpoints.workOrders.detail(id));

const create = (body: Omit<WorkOrder, "id">) =>
  api.post<WorkOrder>(endpoints.workOrders(), body);

const update = (body: Pick<WorkOrder, "id"> & Partial<Omit<WorkOrder, "id">>) =>
  api.patch<WorkOrder>(endpoints.workOrders.detail(body.id), body);

const _delete = (body: WorkOrder["id"]) =>
  api.delete(endpoints.workOrders.detail(body));

export const workOrderApi = {
  list,
  detail,
  create,
  update,
  delete: _delete,
};
