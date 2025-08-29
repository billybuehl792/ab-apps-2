import { type ComponentProps } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { workOrderMutations } from "@/store/mutations/work-orders";
import WorkOrderForm from "@/containers/forms/WorkOrderForm";

export const Route = createFileRoute("/app/work-orders/create")({
  loader: () => ({ crumb: "Create Work Order" }),
  component: RouteComponent,
});

function RouteComponent() {
  /** Values */

  const navigate = useNavigate();

  /** Mutations */

  const createWorkOrderMutation = useMutation(workOrderMutations.create());

  /** Callbacks */

  const handleSubmit: ComponentProps<typeof WorkOrderForm>["onSubmit"] = (
    data
  ) =>
    createWorkOrderMutation.mutateAsync(data, {
      onSuccess: (res) => navigate({ to: `/app/work-orders/${res.data.id}` }),
    });

  return <WorkOrderForm onSubmit={handleSubmit} />;
}
