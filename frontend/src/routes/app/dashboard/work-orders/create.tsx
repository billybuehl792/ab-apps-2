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
import { WORK_ORDER_ICON } from "@/store/constants/work-orders";

type SearchParams = { client?: number };

export const Route = createFileRoute("/app/dashboard/work-orders/create")({
  validateSearch: (search: Record<string, unknown>): SearchParams => ({
    client: search.client ? Number(search.client) : undefined,
  }),
  loader: async ({ context, location }) => {
    const search = location.search as SearchParams;
    let client = null;
    if (search.client)
      client = await context.queryClient.fetchQuery(
        clientQueries.detail(Number(search.client))
      );

    const crumb: Crumb = { label: "Create", Icon: WORK_ORDER_ICON };

    return { crumb, client };
  },
  loaderDeps: ({ search }) => [search.client],
  component: RouteComponent,
});

function RouteComponent() {
  /** Values */

  const navigate = useNavigate();
  const router = useRouter();
  const loaderData = Route.useLoaderData();

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
        client: loaderData?.client ?? undefined,
        place: loaderData?.client?.place ?? undefined,
      }}
      resetLabel="Cancel"
      onSubmit={handleSubmit}
      onReset={() => router.history.back()}
      onSuccess={(res) => handleNavigateWorkOrder(res.data.id)}
    />
  );
}
