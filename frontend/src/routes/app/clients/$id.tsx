import StatusCard from "@/components/cards/StatusCard";
import ClientDetailCard from "@/containers/cards/ClientDetailCard";
import { clientQueries } from "@/store/queries/clients";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/clients/$id")({
  loader: async ({ context, params }) => {
    const client = await context.queryClient.fetchQuery(
      clientQueries.detail(params.id)
    );

    return { client, crumb: `${client.first_name} ${client.last_name}` };
  },
  pendingComponent: () => (
    <StatusCard loading description="loading client..." />
  ),
  component: RouteComponent,
  errorComponent: ({ error }) => <StatusCard error={error} />,
});

function RouteComponent() {
  /** Values */

  const { client } = Route.useLoaderData();

  return <ClientDetailCard client={client} />;
}
