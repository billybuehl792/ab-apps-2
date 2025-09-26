import { createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowBack } from "@mui/icons-material";
import { accountQueries } from "@/store/queries/account";
import StatusCard from "@/components/cards/StatusCard";
import UserDetailCard from "@/containers/cards/UserDetailCard";
import { ACCOUNT_ICON } from "@/store/constants/account";
import CustomLink from "@/components/links/CustomLink";
import { errorUtils } from "@/store/utils/error";

export const Route = createFileRoute("/app/dashboard/profile/$id")({
  loader: async ({ context, params }) => {
    try {
      if (isNaN(Number(params.id))) throw new Error("Invalid user ID");

      const user = await context.queryClient.fetchQuery(
        accountQueries.users.detail(Number(params.id))
      );
      const crumb: Crumb = { label: user.username, Icon: ACCOUNT_ICON };

      return { crumb, user };
    } catch (error) {
      throw notFound({ data: errorUtils.getErrorMessage(error) });
    }
  },
  component: RouteComponent,
  pendingComponent: () => <StatusCard loading="loading user..." m={2} />,
  errorComponent: ({ error }) => <StatusCard error={error} m={2} />,
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

  const user = loaderData.user;

  return <UserDetailCard user={user} />;
}
