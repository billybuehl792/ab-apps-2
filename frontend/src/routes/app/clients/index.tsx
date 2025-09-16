import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { clientQueries } from "@/store/queries/clients";
import { paramUtils } from "@/store/utils/params";
import ClientPaginatedList from "@/containers/lists/ClientPaginatedList";
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
    <ClientPaginatedList
      queryOptions={queryOptions}
      onParamsChange={handleParamsChange}
    />
  );
}
