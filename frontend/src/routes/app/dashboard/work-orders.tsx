import { createFileRoute } from "@tanstack/react-router";
import { WORK_ORDERS_ICON } from "@/store/constants/work-orders";

export const Route = createFileRoute("/app/dashboard/work-orders")({
  loader: () => {
    const crumb: Crumb = { label: "Work Orders", Icon: WORK_ORDERS_ICON };
    return { crumb };
  },
});
