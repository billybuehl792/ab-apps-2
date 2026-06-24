import { createFileRoute, notFound } from "@tanstack/react-router";
import { AccountIcons, userEndpoints } from "@/store/constants/account";
import UserDetailCard from "@/containers/cards/UserDetailCard";
import StatusWrapper from "@/components/layout/StatusWrapper";
import { errorUtils } from "@/store/utils/error";

export const Route = createFileRoute("/app/admin/users/$id")({
  beforeLoad: async ({ context, params }) => {
    try {
      const user = await context.queryClient.fetchQuery({
        queryKey: userEndpoints.user(params.id).id,
        queryFn: userEndpoints.user(params.id).get,
      });

      return {
        user,
        crumb: { label: user.username, Icon: AccountIcons.users.Detail },
      };
    } catch (error) {
      throw notFound({ data: errorUtils.getErrorMessage(error) });
    }
  },
  component: RouteComponent,
  pendingComponent: () => <StatusWrapper loading="loading user..." />,
});

function RouteComponent() {
  /** Values */

  const { user } = Route.useRouteContext();

  return <UserDetailCard user={user} />;
}
