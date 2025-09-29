import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Add } from "@mui/icons-material";
import { clientQueries } from "@/store/queries/clients";
import PaginatedQueryList from "@/components/lists/PaginatedQueryList";
import ClientListCard from "@/containers/cards/ClientListCard";
import ClientListParamsForm from "@/containers/forms/ClientListParamsForm";
import CustomLink from "@/components/links/CustomLink";
import { paramUtils } from "@/store/utils/params";
import { page } from "@/store/constants/layout";
import type { ClientApiListRequest } from "@/store/types/clients";
import type { RouteLoaderData } from "@/store/types/router";

const cleanParams = (params: Record<string, unknown>) => {
  const city = params.place__city;
  const workOrdersStatus = params.work_orders__status;
  if (city && !(city instanceof Array)) params.place__city = [city];
  if (workOrdersStatus && !(workOrdersStatus instanceof Array))
    params.work_orders__status = [workOrdersStatus];

  return paramUtils.cleanApiListRequestParams<ClientApiListRequest>(params);
};

export const Route = createFileRoute("/app/dashboard/clients/")({
  validateSearch: cleanParams,
  loader: (): RouteLoaderData => ({
    slotProps: {
      pageHeader: {
        endContent: (
          <CustomLink
            label="Create"
            to="/app/dashboard/clients/create"
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

  const queryOptions = clientQueries.list(params);

  /** Callbacks */

  const handleParamsChange = (newParams: ClientApiListRequest) =>
    navigate({ to: "/app/dashboard/clients", search: cleanParams(newParams) });

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
