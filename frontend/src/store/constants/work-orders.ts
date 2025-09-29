import { Cases, Work } from "@mui/icons-material";

/** Icons */

export const WorkOrderIcons = {
  List: Cases,
  Detail: Work,
  Create: Work,
};

/** API */

export const workOrderEndpoints = {
  workOrders: Object.assign(
    () => `${import.meta.env.VITE_BACKEND_BASE_URL}/api/work-orders/`,
    {
      detail: (id: number) => `${workOrderEndpoints.workOrders()}${id}/`,
      count: () => `${workOrderEndpoints.workOrders()}count/`,
    }
  ),
};
