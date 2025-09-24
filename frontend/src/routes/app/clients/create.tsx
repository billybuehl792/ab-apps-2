import {
  createFileRoute,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { clientMutations } from "@/store/mutations/clients";
import ClientForm, {
  type ClientFormValues,
} from "@/containers/forms/ClientForm";

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

  const handleSubmit = (data: ClientFormValues) =>
    createClientMutation.mutateAsync({
      ...data,
      place: data.place?.id ?? null,
    });

  const handleNavigateClient = (id: number) =>
    navigate({ to: "/app/clients/$id", params: { id: String(id) } });

  return (
    <ClientForm
      resetLabel="Cancel"
      onSubmit={handleSubmit}
      onReset={() => router.history.back()}
      onSuccess={(res) => handleNavigateClient(res.data.id)}
    />
  );
}
