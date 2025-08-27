import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { Stack, Typography } from "@mui/material";
import ProfileProvider from "@/containers/providers/ProfileProvider";
import { profileQueries } from "@/store/queries/profile";

export const Route = createFileRoute("/app")({
  beforeLoad: async ({ context, location }) => {
    if (!context.auth.isAuthenticated)
      throw redirect({
        to: "/sign-in",
        search: { redirect: location.href },
        replace: true,
      });

    const me = await context.queryClient.ensureQueryData(profileQueries.me());

    return { me };
  },
  component: RouteComponent,
});

function RouteComponent() {
  /** Values */

  const { me } = Route.useRouteContext();

  return (
    <ProfileProvider me={me}>
      <Stack spacing={2}>
        <Typography variant="h6">Current User: {me.username}</Typography>
        <Outlet />
      </Stack>
    </ProfileProvider>
  );
}
