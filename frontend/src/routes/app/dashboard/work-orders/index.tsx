import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Add } from "@mui/icons-material";
import { workOrderQueries } from "@/store/queries/work-orders";
import PaginatedQueryList from "@/components/lists/PaginatedQueryList";
import WorkOrderListParamsForm from "@/containers/forms/WorkOrderListParamsForm";
import WorkOrderListCard from "@/containers/cards/WorkOrderListCard";
import CustomLink from "@/components/links/CustomLink";
import { paramUtils } from "@/store/utils/params";
import { page } from "@/store/constants/layout";
import type { WorkOrderListRequestParams } from "@/store/types/work-orders";
import type { RouteLoaderData } from "@/store/types/router";

const cleanParams = (params: Record<string, unknown>) => {
  const status = params.status;
  const client = params.client;
  const city = params.place__city;
  if (status && !(status instanceof Array)) params.status = [status];
  if (client && !(client instanceof Array)) params.client = [client];
  if (city && !(city instanceof Array)) params.place__city = [city];

  return paramUtils.cleanListRequestParamsParams<WorkOrderListRequestParams>(
    params
  );
};

export const Route = createFileRoute("/app/dashboard/work-orders/")({
  validateSearch: cleanParams,
  loader: (): RouteLoaderData => ({
    slotProps: {
      pageHeader: {
        endContent: (
          <CustomLink
            label="Create"
            to="/app/dashboard/work-orders/create"
            Icon={Add}
          />
        ),
      },
    },
  }),
  component: RouteComponent,
});

function RouteComponent() {
  /** Values */

  const params = Route.useSearch();
  const navigate = useNavigate();

  /** Values */

  const queryOptions = workOrderQueries.list(params);

  /** Callbacks */

  const handleParamsChange = (newParams: WorkOrderListRequestParams) =>
    navigate({
      to: "/app/dashboard/work-orders",
      search: cleanParams(newParams),
    });

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
          top: page.header.height + 16,
          zIndex: 2,
          bgcolor: "background.paper",
          boxShadow: (theme) =>
            `0px -${page.header.height / 4}px ${theme.palette.background.paper}`,
        },
      }}
    />
  );
}
