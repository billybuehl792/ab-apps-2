import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { workOrderQueries } from "@/store/queries/work-orders";
import { paramUtils } from "@/store/utils/params";
import WorkOrderPaginatedList from "@/containers/lists/WorkOrderPaginatedList";
import type { WorkOrderApiListRequest } from "@/store/types/work-orders";

const cleanParams = (params: Record<string, unknown>) => {
  const status = params.status;
  const client = params.client;
  const city = params.place__city;
  if (status && !(status instanceof Array)) params.status = [status];
  if (client && !(client instanceof Array)) params.client = [client];
  if (city && !(city instanceof Array)) params.place__city = [city];

  return paramUtils.cleanApiListRequestParams<WorkOrderApiListRequest>(params);
};

export const Route = createFileRoute("/app/work-orders/")({
  validateSearch: cleanParams,
  component: RouteComponent,
});

function RouteComponent() {
  /** Values */

  const params = Route.useSearch();
  const navigate = useNavigate();

  const queryOptions = workOrderQueries.list(params);

  /** Callbacks */

  const handleParamsChange = (newParams: WorkOrderApiListRequest) =>
    navigate({ to: "/app/work-orders", search: cleanParams(newParams) });

  return (
    <WorkOrderPaginatedList
      queryOptions={queryOptions}
      onParamsChange={handleParamsChange}
    />
  );
}
