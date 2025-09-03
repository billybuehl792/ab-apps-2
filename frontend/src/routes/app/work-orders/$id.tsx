import { type ComponentProps } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { Box } from "@mui/material";
import { workOrderMutations } from "@/store/mutations/work-orders";
import { workOrderQueries } from "@/store/queries/workOrders";
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
  pendingComponent: () => <StatusCard loading="loading work order..." />,
  component: RouteComponent,
  errorComponent: ({ error }) => <StatusCard error={error} />,
});

function RouteComponent() {
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
  >["form"]["onSubmit"] = (values) =>
    updateWorkOrderMutation.mutateAsync(
      { id: workOrder.id, ...values },
      { onSuccess: handleOnClose }
    );

  const handleOnClose = () =>
    navigate({
      to: "/app/work-orders/$id",
      params: { id: String(workOrder.id) },
      search: { edit: false },
    });

  return (
    <Box p={2}>
      <WorkOrderDetailCard workOrder={workOrder} />
      <WorkOrderFormDrawer
        open={isEditing}
        form={{ values: workOrder, onSubmit: handleUpdateWorkOrder }}
        onClose={handleOnClose}
      />
    </Box>
  );
}
