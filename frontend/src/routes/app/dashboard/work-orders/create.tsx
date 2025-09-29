import {
  createFileRoute,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { clientQueries } from "@/store/queries/clients";
import { workOrderMutations } from "@/store/mutations/work-orders";
import WorkOrderForm, {
  type WorkOrderFormValues,
} from "@/containers/forms/WorkOrderForm";
import { WorkOrderIcons } from "@/store/constants/work-orders";
import type { RouteLoaderData } from "@/store/types/router";
import type { Client } from "@/store/types/clients";

type SearchParams = { client?: number };

export const Route = createFileRoute("/app/dashboard/work-orders/create")({
  validateSearch: (search: Record<string, unknown>): SearchParams => ({
    client: search.client ? Number(search.client) : undefined,
  }),
  loader: async ({
    context,
    location,
  }): Promise<RouteLoaderData<Client | null>> => {
    const search = location.search as SearchParams;
    let client = null;
    if (search.client)
      client = await context.queryClient.fetchQuery(
        clientQueries.detail(Number(search.client))
      );

    return {
      data: client,
      crumb: { label: "Create", Icon: WorkOrderIcons.Create },
    };
  },
  loaderDeps: ({ search }) => [search.client],
  component: RouteComponent,
});

function RouteComponent() {
  /** Values */

  const navigate = useNavigate();
  const router = useRouter();
  const loaderData = Route.useLoaderData();

  const client = loaderData?.data ?? null;

  /** Mutations */

  const createWorkOrderMutation = useMutation(workOrderMutations.create());

  /** Callbacks */

  const handleSubmit = (data: WorkOrderFormValues) =>
    createWorkOrderMutation.mutateAsync({
      ...data,
      client: data.client?.id ?? null,
      place: data.place?.google_place_id ?? null,
      cost: Number(data.cost),
    });

  const handleNavigateWorkOrder = (id: number) =>
    navigate({
      to: "/app/dashboard/work-orders/$id",
      params: { id: String(id) },
    });

  return (
    <WorkOrderForm
      defaultValues={{
        client: client,
        place: client?.place ?? undefined,
      }}
      resetLabel="Cancel"
      onSubmit={handleSubmit}
      onReset={() => router.history.back()}
      onSuccess={(res) => handleNavigateWorkOrder(res.data.id)}
    />
  );
}
