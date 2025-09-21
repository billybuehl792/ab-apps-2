import { useState, type ComponentProps } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { Stack, Tab, Tabs } from "@mui/material";
import { workOrderQueries } from "@/store/queries/work-orders";
import { clientMutations } from "@/store/mutations/clients";
import { clientQueries } from "@/store/queries/clients";
import StatusCard from "@/components/cards/StatusCard";
import ClientDetailCard from "@/containers/cards/ClientDetailCard";
import ClientFormDrawer from "@/containers/modals/ClientFormDrawer";
import PaginatedList from "@/components/lists/PaginatedList";
import WorkOrderListCard from "@/containers/cards/WorkOrderListCard";
import type { WorkOrderApiListRequest } from "@/store/types/work-orders";

export const Route = createFileRoute("/app/clients/$id")({
  validateSearch: (search: Record<string, unknown>): { edit?: boolean } => ({
    edit: Boolean(search.edit) || undefined,
  }),
  loader: async ({ context, params }) => {
    const client = await context.queryClient.fetchQuery(
      clientQueries.detail(Number(params.id))
    );

    return { client, crumb: client.full_name };
  },
  component: RouteComponent,
  pendingComponent: () => <StatusCard loading="loading client..." m={2} />,
  errorComponent: ({ error }) => <StatusCard error={error} m={2} />,
});

function RouteComponent() {
  const [tabValue, setTabValue] = useState(0);
  const [workOrderListParams, setWorkOrderListParams] =
    useState<WorkOrderApiListRequest>({});

  /** Values */

  const loaderData = Route.useLoaderData();
  const search = Route.useSearch();
  const navigate = useNavigate();

  const client = loaderData.client;
  const isEditing = search.edit;

  /** Queries */

  const workOrderListQueryOptions = workOrderQueries.list({
    client: [client.id],
    ...workOrderListParams,
  });

  /** Mutations */

  const updateClientMutation = useMutation(clientMutations.update());

  /** Callbacks */

  const handleUpdateClient: ComponentProps<
    typeof ClientFormDrawer
  >["form"]["onSubmit"] = (values) =>
    updateClientMutation.mutateAsync(
      {
        ...values,
        id: client.id,
        place: values.place?.google_place_id ?? null,
      },
      { onSuccess: handleOnClose }
    );

  const handleOnClose = () =>
    navigate({
      to: "/app/clients/$id",
      params: { id: String(client.id) },
      search: { edit: false },
    });

  return (
    <Stack spacing={1} p={2}>
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

        <PaginatedList
          queryOptions={workOrderListQueryOptions}
          renderItem={(workOrder) => (
            <WorkOrderListCard key={workOrder.id} workOrder={workOrder} />
          )}
          onPageChange={(page) =>
            setWorkOrderListParams((prev) => ({ ...prev, page }))
          }
        />
      </Stack>

      {/* Modals */}
      <ClientFormDrawer
        open={isEditing}
        form={{ values: client, onSubmit: handleUpdateClient }}
        onClose={handleOnClose}
      />
    </Stack>
  );
}
