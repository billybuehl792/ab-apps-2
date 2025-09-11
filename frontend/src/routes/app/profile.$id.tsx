import { createFileRoute } from "@tanstack/react-router";
import { Box } from "@mui/material";
import StatusCard from "@/components/cards/StatusCard";
import UserDetailCard from "@/containers/cards/UserDetailCard";
import { accountQueries } from "@/store/queries/account";

export const Route = createFileRoute("/app/profile/$id")({
  loader: async ({ context, params }) => {
    const user = await context.queryClient.fetchQuery(
      accountQueries.users.detail(Number(params.id))
    );

    return { user, crumb: user.username };
  },
  component: RouteComponent,
  pendingComponent: () => <StatusCard loading="loading user..." m={2} />,
  errorComponent: ({ error }) => <StatusCard error={error} m={2} />,
});

function RouteComponent() {
  /** Values */

  const loaderData = Route.useLoaderData();

  const user = loaderData.user;

  return (
    <Box p={2}>
      <UserDetailCard user={user} />
    </Box>
  );
}
