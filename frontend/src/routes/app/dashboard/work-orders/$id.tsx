import { useState } from "react";
import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { Stack, Tab, Tabs } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { workOrderMutations } from "@/store/mutations/work-orders";
import { workOrderQueries } from "@/store/queries/work-orders";
import CustomLink from "@/components/links/CustomLink";
import StatusCard from "@/components/cards/StatusCard";
import WorkOrderDetailCard from "@/containers/cards/WorkOrderDetailCard";
import WorkOrderFormDrawer from "@/containers/modals/WorkOrderFormDrawer";
import { errorUtils } from "@/store/utils/error";
import { WORK_ORDER_ICON } from "@/store/constants/work-orders";
import type { WorkOrderFormValues } from "@/containers/forms/WorkOrderForm";
import WorkOrderMenuOptionIconButton from "@/containers/buttons/WorkOrderMenuOptionIconButton";
import { WorkOrderOptionId } from "@/store/enums/work-orders";

export const Route = createFileRoute("/app/dashboard/work-orders/$id")({
  validateSearch: (search: Record<string, unknown>): { edit?: boolean } => ({
    edit: Boolean(search.edit) || undefined,
  }),
  beforeLoad: ({ params }) => ({
    slotProps: {
      pageHeader: {
        endContent: (
          <WorkOrderMenuOptionIconButton
            workOrder={Number(params.id)}
            hideOptions={[WorkOrderOptionId.Detail]}
          />
        ),
      },
    },
  }),
  loader: async ({ context, params }) => {
    try {
      if (isNaN(Number(params.id))) throw new Error("Invalid work order ID");

      const workOrder = await context.queryClient.fetchQuery(
        workOrderQueries.detail(Number(params.id))
      );
      const crumb: Crumb = { label: workOrder.label, Icon: WORK_ORDER_ICON };

      return { crumb, workOrder };
    } catch (error) {
      throw notFound({ data: errorUtils.getErrorMessage(error) });
    }
  },
  component: RouteComponent,
  pendingComponent: () => <StatusCard loading="loading work order..." />,
  notFoundComponent: () => (
    <StatusCard
      error={"Work order not found :("}
      description={<CustomLink label="Back" Icon={ArrowBack} to=".." />}
    />
  ),
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

  const handleUpdateWorkOrder = (data: WorkOrderFormValues) =>
    updateWorkOrderMutation.mutateAsync({
      ...data,
      id: workOrder.id,
      client: data.client?.id ?? null,
      place: data.place?.google_place_id ?? null,
      cost: Number(data.cost),
    });

  const handleOnClose = () =>
    navigate({
      to: "/app/dashboard/work-orders/$id",
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
          onSuccess: handleOnClose,
        }}
        onClose={handleOnClose}
      />
    </Stack>
  );
}
