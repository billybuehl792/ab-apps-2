import { createFileRoute, notFound } from "@tanstack/react-router";
import UserDetailCard from "@/containers/cards/UserDetailCard";
import { accountQueries } from "@/store/queries/account";
import { errorUtils } from "@/store/utils/error";
import { AccountIcons } from "@/store/constants/account";

export const Route = createFileRoute("/app/admin/users/$id")({
  beforeLoad: async ({ context, params }) => {
    try {
      const id = Number(params.id);
      if (isNaN(id)) throw new Error("Invalid user ID");
      const user = await context.queryClient.fetchQuery(
        accountQueries.users.user(id).detail,
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
