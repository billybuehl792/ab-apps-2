import {
  createFileRoute,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { clientMutations } from "@/store/mutations/clients";
import { ClientIcons } from "@/store/constants/clients";
import ClientCreateForm, {
  type ClientCreateFormValues,
} from "@/containers/forms/ClientCreateForm";
import type { RouteLoaderData } from "@/store/types/router";

export const Route = createFileRoute("/app/dashboard/clients/create")({
  loader: (): RouteLoaderData => ({
    crumb: { label: "Create Client", Icon: ClientIcons.Create },
  }),
  component: RouteComponent,
});

function RouteComponent() {
  /** Values */

  const router = useRouter();
  const navigate = useNavigate();

  /** Mutations */

  const createClientMutation = useMutation(clientMutations.create());

  /** Callbacks */

  const handleSubmit = (data: ClientCreateFormValues) =>
    createClientMutation.mutateAsync({
      ...data,
      place: data.place?.id ?? null,
    });

  const handleNavigateClient = (id: number) =>
    navigate({ to: "/app/dashboard/clients/$id", params: { id: String(id) } });

  return (
    <ClientCreateForm
      resetLabel="Cancel"
      onSubmit={handleSubmit}
      onReset={() => router.history.back()}
      onSuccess={(res) => handleNavigateClient(res.data.id)}
    />
  );
}
