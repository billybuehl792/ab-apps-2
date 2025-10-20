import { useState } from "react";
import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { Stack, Tab, Tabs } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { clientMutations } from "@/store/mutations/clients";
import { clientQueries } from "@/store/queries/clients";
import StatusCard from "@/components/cards/StatusCard";
import ClientDetailCard from "@/containers/cards/ClientDetailCard";
import ClientFormDrawer from "@/containers/modals/ClientFormDrawer";
import CustomLink from "@/components/links/CustomLink";
import ClientMenuOptionIconButton from "@/containers/buttons/ClientMenuOptionIconButton";
import WorkOrderList from "@/containers/lists/WorkOrderList";
import { errorUtils } from "@/store/utils/error";
import { ClientIcons } from "@/store/constants/clients";
import { ClientOptionId } from "@/store/enums/clients";
import type { WorkOrderListRequestParams } from "@/store/types/work-orders";
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
        crumb: { label: client.full_name, Icon: ClientIcons.Detail },
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
      error="Client not found :("
      description={<CustomLink label="Back" Icon={ArrowBack} to=".." />}
    />
  ),
});

function RouteComponent() {
  const [tabValue, setTabValue] = useState(0);
  const [workOrderListParams, setWorkOrderListParams] =
    useState<WorkOrderListRequestParams>({});

  /** Values */

  const loaderData = Route.useLoaderData();
  const search = Route.useSearch();
  const navigate = useNavigate();

  const client = loaderData.data;
  const isEditing = search.edit;

  /** Mutations */

  const updateClientMutation = useMutation(clientMutations.update());

  /** Callbacks */

  const handleUpdateClient = (data: ClientFormValues) =>
    updateClientMutation.mutateAsync({
      id: client.id,
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone_primary: data.phonePrimary,
      phone_secondary: data.phoneSecondary,
      place: data.place,
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

        <WorkOrderList
          params={{ ...workOrderListParams, page_size: 1 }}
          baseParams={{ client: [client.id] }}
          onParamsChange={setWorkOrderListParams}
        />
      </Stack>

      {/* Modals */}
      <ClientFormDrawer
        open={isEditing}
        title={client.full_name}
        form={{
          values: {
            firstName: client.first_name,
            lastName: client.last_name,
            email: client.email,
            phonePrimary: client.phone_primary,
            phoneSecondary: client.phone_secondary,
            place: client.place,
          },
          onSubmit: handleUpdateClient,
          onSuccess: handleOnClose,
        }}
        onClose={handleOnClose}
      />
    </Stack>
  );
}
