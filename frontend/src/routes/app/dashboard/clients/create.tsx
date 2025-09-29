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
import { CLIENT_CREATE_ICON } from "@/store/constants/clients";
import { RouteLoaderData } from "@/store/types/router";

export const Route = createFileRoute("/app/dashboard/clients/create")({
  loader: (): RouteLoaderData => ({
    crumb: { label: "Create Client", Icon: CLIENT_CREATE_ICON },
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

  const handleSubmit = (data: ClientFormValues) =>
    createClientMutation.mutateAsync({
      ...data,
      place: data.place?.id ?? null,
    });

  const handleNavigateClient = (id: number) =>
    navigate({ to: "/app/dashboard/clients/$id", params: { id: String(id) } });

  return (
    <ClientForm
      resetLabel="Cancel"
      onSubmit={handleSubmit}
      onReset={() => router.history.back()}
      onSuccess={(res) => handleNavigateClient(res.data.id)}
    />
  );
}
