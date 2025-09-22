import { useState, type ComponentProps } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { Stack, Tab, Tabs } from "@mui/material";
import { workOrderMutations } from "@/store/mutations/work-orders";
import { workOrderQueries } from "@/store/queries/work-orders";
import StatusCard from "@/components/cards/StatusCard";
import WorkOrderDetailCard from "@/containers/cards/WorkOrderDetailCard";
import WorkOrderFormDrawer from "@/containers/modals/WorkOrderFormDrawer";

export const Route = createFileRoute("/app/work-orders/$id")({
  validateSearch: (search: Record<string, unknown>): { edit?: boolean } => ({
    edit: Boolean(search.edit) || undefined,
  }),
  loader: async ({ context, params }) => {
    const workOrder = await context.queryClient.fetchQuery(
      workOrderQueries.detail(Number(params.id))
    );

    return { workOrder, crumb: workOrder.label };
  },
  component: RouteComponent,
  pendingComponent: () => <StatusCard loading="loading work order..." />,
});

function RouteComponent() {
  const [tabValue, setTabValue] = useState(0);

  /** Values */

  const loaderData = Route.useLoaderData();
  const search = Route.useSearch();
  const navigate = useNavigate();

  const workOrder = loaderData.workOrder;
  const isEditing = search.edit;

  /** Mutations */

  const updateWorkOrderMutation = useMutation(workOrderMutations.update());

  /** Callbacks */

  const handleUpdateWorkOrder: ComponentProps<
    typeof WorkOrderFormDrawer
  >["form"]["onSubmit"] = (data) => {
    return updateWorkOrderMutation.mutateAsync(
      {
        ...data,
        id: workOrder.id,
        client: data.client?.id ?? null,
        place: data.place?.google_place_id ?? null,
        cost: Number(data.cost),
      },
      { onSuccess: handleOnClose }
    );
  };

  const handleOnClose = () =>
    navigate({
      to: "/app/work-orders/$id",
      params: { id: String(workOrder.id) },
      search: { edit: false },
    });

  return (
    <Stack spacing={1}>
      <WorkOrderDetailCard workOrder={workOrder} />
      <Tabs
        value={tabValue}
        variant="scrollable"
        scrollButtons={false}
        onChange={(_, newValue) => setTabValue(newValue)}
      >
        <Tab label="Documents" />
        <Tab label="History" />
      </Tabs>

      {/* Modals */}
      <WorkOrderFormDrawer
        open={isEditing}
        form={{
          values: workOrder,
          onSubmit: handleUpdateWorkOrder,
        }}
        onClose={handleOnClose}
      />
    </Stack>
  );
}
