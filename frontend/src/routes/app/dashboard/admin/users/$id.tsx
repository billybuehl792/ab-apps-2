import { createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowBack } from "@mui/icons-material";
import { accountQueries } from "@/store/queries/account";
import CustomLink from "@/components/links/CustomLink";
import StatusCard from "@/components/cards/StatusCard";
import UserDetailCard from "@/containers/cards/UserDetailCard";
import { errorUtils } from "@/store/utils/error";
import { ADMIN_USER_ICON } from "@/store/constants/admin";

export const Route = createFileRoute("/app/dashboard/admin/users/$id")({
  loader: async ({ context, params }) => {
    try {
      if (isNaN(Number(params.id))) throw new Error("Invalid user ID");
      const user = await context.queryClient.fetchQuery(
        accountQueries.users.detail(Number(params.id))
      );
      const crumb: Crumb = { label: user.username, Icon: ADMIN_USER_ICON };

      return { user, crumb };
    } catch (error) {
      throw notFound({ data: errorUtils.getErrorMessage(error) });
    }
  },
  component: RouteComponent,
  pendingComponent: () => <StatusCard loading="loading user..." />,
  notFoundComponent: () => (
    <StatusCard
      error={"User not found :("}
      description={<CustomLink label="Back" Icon={ArrowBack} to=".." />}
    />
  ),
});

function RouteComponent() {
  /** Values */

  const loaderData = Route.useLoaderData();

  return <UserDetailCard user={loaderData.user} />;
}
