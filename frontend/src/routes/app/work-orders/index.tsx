import { type ComponentProps } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { workOrderApi } from "@/store/api/work-orders";
import WorkOrderList from "@/containers/lists/WorkOrderList";

export const Route = createFileRoute("/app/work-orders/")({
  validateSearch: (
    search: Record<string, unknown>
  ): Parameters<typeof workOrderApi.list>[0] => ({
    page: search?.page ? Number(search.page) : undefined,
  }),
  component: RouteComponent,
});

function RouteComponent() {
  /** Values */

  const params = Route.useSearch();
  const navigate = useNavigate();

  /** Callbacks */

  const onPageChange: ComponentProps<typeof WorkOrderList>["onPageChange"] = (
    page
  ) => navigate({ to: "/app/work-orders", search: { ...params, page } });

  return <WorkOrderList params={params} onPageChange={onPageChange} />;
}
