import { type ComponentProps } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { Box } from "@mui/material";
import { clientMutations } from "@/store/mutations/clients";
import { clientQueries } from "@/store/queries/clients";
import StatusCard from "@/components/cards/StatusCard";
import ClientDetailCard from "@/containers/cards/ClientDetailCard";
import ClientFormDrawer from "@/containers/modals/ClientFormDrawer";

export const Route = createFileRoute("/app/clients/$id")({
  validateSearch: (search: Record<string, unknown>): { edit?: boolean } => ({
    edit: Boolean(search.edit) || undefined,
  }),
  loader: async ({ context, params }) => {
    const client = await context.queryClient.fetchQuery(
      clientQueries.detail(params.id)
    );

    return { client, crumb: `${client.first_name} ${client.last_name}` };
  },
  pendingComponent: () => <StatusCard loading="loading client..." m={2} />,
  component: RouteComponent,
  errorComponent: ({ error }) => <StatusCard error={error} m={2} />,
});

function RouteComponent() {
  /** Values */

  const loaderData = Route.useLoaderData();
  const search = Route.useSearch();
  const navigate = useNavigate();

  const client = loaderData.client;
  const isEditing = search.edit;

  /** Mutations */

  const updateClientMutation = useMutation(clientMutations.update());

  /** Callbacks */

  const handleUpdateClient: ComponentProps<
    typeof ClientFormDrawer
  >["form"]["onSubmit"] = (values) =>
    updateClientMutation.mutateAsync(
      { id: client.id, ...values },
      { onSuccess: handleOnClose }
    );

  const handleOnClose = () =>
    navigate({
      to: "/app/clients/$id",
      params: { id: client.id },
      search: { edit: false },
    });

  return (
    <Box p={2}>
      <ClientDetailCard client={client} />
      <ClientFormDrawer
        open={isEditing}
        form={{ values: client, onSubmit: handleUpdateClient }}
        onClose={handleOnClose}
      />
    </Box>
  );
}
