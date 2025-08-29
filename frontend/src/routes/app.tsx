import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { authQueries } from "@/store/queries/auth";
import ProfileProvider from "@/containers/providers/ProfileProvider";
import StatusCard from "@/components/cards/StatusCard";

export const Route = createFileRoute("/app")({
  beforeLoad: ({ context, location }) => {
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
    return (
      <StatusCard
        loading={meQuery.isLoading && "Loading user..."}
        error={meQuery.error}
      />
    );
  return (
    <ProfileProvider me={meQuery.data}>
      <Outlet />
    </ProfileProvider>
  );
}
