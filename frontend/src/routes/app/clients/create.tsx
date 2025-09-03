import { type ComponentProps } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { clientMutations } from "@/store/mutations/clients";
import ClientForm from "@/containers/forms/ClientForm";

export const Route = createFileRoute("/app/clients/create")({
  loader: () => ({ crumb: "Create Client" }),
  component: RouteComponent,
});

function RouteComponent() {
  /** Values */

  const navigate = useNavigate();

  /** Mutations */

  const createClientMutation = useMutation(clientMutations.create());

  /** Callbacks */

  const handleSubmit: ComponentProps<typeof ClientForm>["onSubmit"] = (data) =>
    createClientMutation.mutateAsync(data, {
      onSuccess: (res) => navigate({ to: `/app/clients/${res.data.id}` }),
    });

  return <ClientForm p={2} onSubmit={handleSubmit} />;
}
