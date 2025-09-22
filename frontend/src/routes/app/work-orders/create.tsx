import { type ComponentProps } from "react";
import {
  createFileRoute,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { clientQueries } from "@/store/queries/clients";
import { workOrderMutations } from "@/store/mutations/work-orders";
import WorkOrderForm from "@/containers/forms/WorkOrderForm";
import { WorkOrderStatus } from "@/store/enums/work-orders";

type SearchParams = { client?: number };

export const Route = createFileRoute("/app/work-orders/create")({
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

    return { crumb: "Create", client };
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

  const handleSubmit: ComponentProps<typeof WorkOrderForm>["onSubmit"] = (
    data
  ) =>
    createWorkOrderMutation.mutateAsync(
      {
        ...data,
        client: data.client?.id ?? null,
        place: data.place?.google_place_id ?? null,
        cost: Number(data.cost),
      },
      {
        onSuccess: (res) => navigate({ to: `/app/work-orders/${res.data.id}` }),
      }
    );

  return (
    <WorkOrderForm
      spacing={2}
      defaultValues={{
        status: WorkOrderStatus.New,
        client: loaderData?.client ?? undefined,
        place: loaderData?.client?.place ?? undefined,
      }}
      resetLabel="Cancel"
      onSubmit={handleSubmit}
      onReset={router.history.back}
      slotProps={{ fieldset: { spacing: 2 } }}
    />
  );
}
