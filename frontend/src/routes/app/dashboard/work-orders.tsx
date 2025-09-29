import { createFileRoute } from "@tanstack/react-router";
import { WorkOrderIcons } from "@/store/constants/work-orders";
import type { RouteLoaderData } from "@/store/types/router";

export const Route = createFileRoute("/app/dashboard/work-orders")({
  loader: (): RouteLoaderData => ({
    crumb: { label: "Work Orders", Icon: WorkOrderIcons.List },
  }),
});
