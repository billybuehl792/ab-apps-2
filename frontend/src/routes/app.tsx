import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Stack, Typography } from "@mui/material";
import { authQueries } from "@/store/queries/auth";
import ProfileProvider from "@/containers/providers/ProfileProvider";
import StatusCard from "@/components/cards/StatusCard";

export const Route = createFileRoute("/app")({
  beforeLoad: async ({ context, location }) => {
    if (!context.auth.isAuthenticated)
      throw redirect({
        to: "/sign-in",
        search: { redirect: location.href },
        replace: true,
      });
  },
  component: RouteComponent,
});

function RouteComponent() {
  /** Queries */

  const meQuery = useQuery(authQueries.me());

  if (!meQuery.isSuccess)
    return <StatusCard loading={meQuery.isLoading} error={meQuery.error} />;
  return (
    <ProfileProvider me={meQuery.data}>
      <Stack spacing={2}>
        <Typography variant="h6">
          Current User: {meQuery.data.username}
        </Typography>
        <Outlet />
      </Stack>
    </ProfileProvider>
  );
}
