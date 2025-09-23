import StatusCard from "@/components/cards/StatusCard";
import UserDetailCard from "@/containers/cards/UserDetailCard";
import { accountQueries } from "@/store/queries/account";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/admin/users/$id")({
  loader: async ({ context, params }) => {
    const user = await context.queryClient.fetchQuery(
      accountQueries.users.detail(Number(params.id))
    );

    return { user, crumb: user.username };
  },
  component: RouteComponent,
  pendingComponent: () => <StatusCard loading="loading user..." />,
});

function RouteComponent() {
  /** Values */

  const loaderData = Route.useLoaderData();

  return <UserDetailCard user={loaderData.user} />;
}
