import {
  createFileRoute,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { workOrderMutations } from "@/store/mutations/work-orders";
import WorkOrderForm, {
  type WorkOrderFormValues,
} from "@/containers/forms/WorkOrderForm";
import { WorkOrderIcons } from "@/store/constants/work-orders";
import type { RouteLoaderData } from "@/store/types/router";

export const Route = createFileRoute("/app/dashboard/work-orders/create")({
  loader: (): RouteLoaderData => ({
    crumb: { label: "Create", Icon: WorkOrderIcons.Create },
  }),
  component: RouteComponent,
});

function RouteComponent() {
  /** Values */

  const navigate = useNavigate();
  const router = useRouter();

  /** Mutations */

  const createWorkOrderMutation = useMutation(workOrderMutations.create());

  /** Callbacks */

  const handleSubmit = (data: WorkOrderFormValues) =>
    createWorkOrderMutation.mutateAsync({
      label: data.label,
      description: data.description,
      place: data.place,
      status: data.status,
      cost: data.cost,
      completed_date: data.completedDate,
      scheduled_date: data.scheduledDate,
    });

  const handleNavigateWorkOrder = (id: number) =>
    navigate({
      to: "/app/dashboard/work-orders/$id",
      params: { id: String(id) },
    });

  return (
    <WorkOrderForm
      resetLabel="Cancel"
      onSubmit={handleSubmit}
      onReset={() => router.history.back()}
      onSuccess={(res) => handleNavigateWorkOrder(res.data.id)}
    />
  );
}
