import { useState } from "react";
import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { Stack, Tab, Tabs } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { workOrderQueries } from "@/store/queries/work-orders";
import { clientMutations } from "@/store/mutations/clients";
import { clientQueries } from "@/store/queries/clients";
import PaginatedQueryList from "@/components/lists/PaginatedQueryList";
import StatusCard from "@/components/cards/StatusCard";
import ClientDetailCard from "@/containers/cards/ClientDetailCard";
import ClientFormDrawer from "@/containers/modals/ClientFormDrawer";
import WorkOrderListCard from "@/containers/cards/WorkOrderListCard";
import WorkOrderListParamsForm from "@/containers/forms/WorkOrderListParamsForm";
import CustomLink from "@/components/links/CustomLink";
import ClientMenuOptionIconButton from "@/containers/buttons/ClientMenuOptionIconButton";
import { errorUtils } from "@/store/utils/error";
import { CLIENT_ICON } from "@/store/constants/clients";
import { ClientOptionId } from "@/store/enums/clients";
import type { WorkOrderApiListRequest } from "@/store/types/work-orders";
import type { ClientFormValues } from "@/containers/forms/ClientForm";
import type { RouteLoaderData } from "@/store/types/router";
import type { Client } from "@/store/types/clients";

export const Route = createFileRoute("/app/dashboard/clients/$id")({
  validateSearch: (search: Record<string, unknown>): { edit?: boolean } => ({
    edit: Boolean(search.edit) || undefined,
  }),
  loader: async ({ context, params }): Promise<RouteLoaderData<Client>> => {
    try {
      if (isNaN(Number(params.id))) throw new Error("Invalid client ID");

      const client = await context.queryClient.fetchQuery(
        clientQueries.detail(Number(params.id))
      );

      return {
        data: client,
        crumb: { label: client.full_name, Icon: CLIENT_ICON },
        slotProps: {
          pageHeader: {
            endContent: (
              <ClientMenuOptionIconButton
                client={client}
                hideOptions={[ClientOptionId.Detail]}
              />
            ),
          },
        },
      };
    } catch (error) {
      throw notFound({ data: errorUtils.getErrorMessage(error) });
    }
  },
  component: RouteComponent,
  pendingComponent: () => <StatusCard loading="loading client..." />,
  notFoundComponent: () => (
    <StatusCard
      error={"Client not found :("}
      description={<CustomLink label="Back" Icon={ArrowBack} to=".." />}
    />
  ),
});

function RouteComponent() {
  const [tabValue, setTabValue] = useState(0);
  const [workOrderListParams, setWorkOrderListParams] =
    useState<WorkOrderApiListRequest>({});

  /** Values */

  const loaderData = Route.useLoaderData();
  const search = Route.useSearch();
  const navigate = useNavigate();

  const client = loaderData.data;
  const isEditing = search.edit;

  /** Queries */

  const workOrderListBaseParams = { client: [client.id] };
  const workOrderListQueryOptions = workOrderQueries.list({
    ...workOrderListParams,
    ...workOrderListBaseParams,
  });

  /** Mutations */

  const updateClientMutation = useMutation(clientMutations.update());

  /** Callbacks */

  const handleUpdateClient = (values: ClientFormValues) =>
    updateClientMutation.mutateAsync({
      ...values,
      id: client.id,
      place: values.place?.google_place_id ?? null,
    });

  const handleOnClose = () =>
    navigate({
      to: "/app/dashboard/clients/$id",
      params: { id: String(client.id) },
      search: { edit: false },
    });

  return (
    <Stack spacing={1}>
      <ClientDetailCard client={client} />
      <Stack spacing={2}>
        <Tabs
          value={tabValue}
          variant="scrollable"
          scrollButtons={false}
          onChange={(_, newValue) => setTabValue(newValue)}
        >
          <Tab label="Work Orders" />
          <Tab label="Documents" />
          <Tab label="History" />
        </Tabs>

        <PaginatedQueryList
          queryOptions={workOrderListQueryOptions}
          ParamsFormComponent={WorkOrderListParamsForm}
          baseParams={workOrderListBaseParams}
          renderItem={(workOrder) => (
            <WorkOrderListCard key={workOrder.id} workOrder={workOrder} />
          )}
          onParamsChange={setWorkOrderListParams}
        />
      </Stack>

      {/* Modals */}
      <ClientFormDrawer
        open={isEditing}
        title={client.full_name}
        form={{
          values: client,
          onSubmit: handleUpdateClient,
          onSuccess: handleOnClose,
        }}
        onClose={handleOnClose}
      />
    </Stack>
  );
}
