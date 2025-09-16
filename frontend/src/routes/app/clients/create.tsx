import { type ComponentProps } from "react";
import {
  createFileRoute,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { clientMutations } from "@/store/mutations/clients";
import ClientForm from "@/containers/forms/ClientForm";

export const Route = createFileRoute("/app/clients/create")({
  loader: () => ({ crumb: "Create Client" }),
  component: RouteComponent,
});

function RouteComponent() {
  /** Values */

  const router = useRouter();
  const navigate = useNavigate();

  /** Mutations */

  const createClientMutation = useMutation(clientMutations.create());

  /** Callbacks */

  const handleSubmit: ComponentProps<typeof ClientForm>["onSubmit"] = (data) =>
    createClientMutation.mutateAsync(
      {
        ...data,
        work_orders: data.work_orders.map(({ id }) => id),
        place: data.place?.id ?? null,
      },
      {
        onSuccess: (res) => navigate({ to: `/app/clients/${res.data.id}` }),
      }
    );

  return (
    <ClientForm
      resetLabel="Cancel"
      p={2}
      onSubmit={handleSubmit}
      onReset={router.history.back}
    />
  );
}
