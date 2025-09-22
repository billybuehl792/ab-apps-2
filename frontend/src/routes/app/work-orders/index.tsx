import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { workOrderQueries } from "@/store/queries/work-orders";
import PaginatedQueryList from "@/components/lists/PaginatedQueryList";
import WorkOrderListParamsForm from "@/containers/forms/WorkOrderListParamsForm";
import WorkOrderListCard from "@/containers/cards/WorkOrderListCard";
import { paramUtils } from "@/store/utils/params";
import { PAGE_HEADER_HEIGHT } from "@/store/constants/layout";
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

  /** Values */

  const queryOptions = workOrderQueries.list(params);

  /** Callbacks */

  const handleParamsChange = (newParams: WorkOrderApiListRequest) =>
    navigate({ to: "/app/work-orders", search: cleanParams(newParams) });

  return (
    <PaginatedQueryList
      queryOptions={queryOptions}
      ParamsFormComponent={WorkOrderListParamsForm}
      renderItem={(workOrder) => (
        <WorkOrderListCard key={workOrder.id} workOrder={workOrder} />
      )}
      onParamsChange={handleParamsChange}
      slotProps={{
        header: {
          position: "sticky",
          top: PAGE_HEADER_HEIGHT + 16,
          zIndex: 2,
          bgcolor: "background.paper",
          boxShadow: (theme) =>
            `0px -${PAGE_HEADER_HEIGHT / 4}px ${theme.palette.background.paper}`,
        },
      }}
    />
  );
}
