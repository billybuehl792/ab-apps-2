import { createFileRoute } from "@tanstack/react-router";
import { Container, Typography } from "@mui/material";
import { accountQueries } from "@/store/queries/account";
import StatusCard from "@/components/cards/StatusCard";
import UserDetailCard from "@/containers/cards/UserDetailCard";
import PageHeader from "@/components/layout/PageHeader";

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
    <Container maxWidth="lg" disableGutters>
      <PageHeader justifyContent="center">
        <Typography variant="h6">Profile</Typography>
      </PageHeader>
      <UserDetailCard user={user} sx={{ m: 2 }} />
    </Container>
  );
}
