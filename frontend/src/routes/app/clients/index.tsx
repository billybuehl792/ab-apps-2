import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { clientQueries } from "@/store/queries/clients";
import PaginatedQueryList from "@/components/lists/PaginatedQueryList";
import ClientListCard from "@/containers/cards/ClientListCard";
import ClientListParamsForm from "@/containers/forms/ClientListParamsForm";
import { paramUtils } from "@/store/utils/params";
import { PAGE_HEADER_HEIGHT } from "@/store/constants/layout";
import type { ClientApiListRequest } from "@/store/types/clients";

const cleanParams = (params: Record<string, unknown>) => {
  const city = params.place__city;
  const workOrdersStatus = params.work_orders__status;
  if (city && !(city instanceof Array)) params.place__city = [city];
  if (workOrdersStatus && !(workOrdersStatus instanceof Array))
    params.work_orders__status = [workOrdersStatus];

  return paramUtils.cleanApiListRequestParams<ClientApiListRequest>(params);
};

export const Route = createFileRoute("/app/clients/")({
  validateSearch: cleanParams,
  component: RouteComponent,
});

function RouteComponent() {
  /** Values */

  const params = Route.useSearch();
  const navigate = useNavigate();

  const queryOptions = clientQueries.list(params);

  /** Callbacks */

  const handleParamsChange = (newParams: ClientApiListRequest) =>
    navigate({ to: "/app/clients", search: cleanParams(newParams) });

  return (
    <PaginatedQueryList
      queryOptions={queryOptions}
      ParamsFormComponent={ClientListParamsForm}
      renderItem={(client) => (
        <ClientListCard key={client.id} client={client} />
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
