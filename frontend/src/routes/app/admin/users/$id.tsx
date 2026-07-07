import { createFileRoute, notFound } from "@tanstack/react-router";
import UserDetailCard from "@/containers/cards/UserDetailCard";
import { usersQueries } from "@/store/queries/account";
import { errorUtils } from "@/store/utils/error";
import { AccountIcons } from "@/store/constants/account";

export const Route = createFileRoute("/app/admin/users/$id")({
  beforeLoad: async ({ context, params }) => {
    try {
      const user = await context.queryClient.fetchQuery(
        usersQueries.user(params.id).detail,
      );

      return {
        user,
        crumb: { label: user.username, Icon: AccountIcons.users.Detail },
      };
    } catch (error) {
      throw notFound({ data: errorUtils.getErrorMessage(error) });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  /** Values */

  const { user } = Route.useRouteContext();

  return <UserDetailCard user={user} />;
}
