import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { Stack, Typography } from "@mui/material";
import ProfileProvider from "@/containers/providers/ProfileProvider";

export const Route = createFileRoute("/app")({
  beforeLoad: ({ context, location }) => {
    if (!context.auth.user)
      throw redirect({
        to: "/sign-in",
        search: { redirect: location.href },
        replace: true,
      });
    return { user: context.auth.user };
  },
  component: RouteComponent,
});

function RouteComponent() {
  /** Values */

  const { user } = Route.useRouteContext();

  return (
    <ProfileProvider me={user}>
      <Stack spacing={2}>
        <Typography variant="h6">Current User: {user.username}</Typography>
        <Outlet />
      </Stack>
    </ProfileProvider>
  );
}
