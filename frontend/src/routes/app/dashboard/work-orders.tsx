import { createFileRoute } from "@tanstack/react-router";
import { WorkOrderIcons } from "@/store/constants/work-orders";
import type { TRouteLoaderData } from "@/store/types/router";

export const Route = createFileRoute("/app/dashboard/work-orders")({
  loader: (): TRouteLoaderData => ({
    crumb: { label: "Work Orders", Icon: WorkOrderIcons.List },
  }),
});
