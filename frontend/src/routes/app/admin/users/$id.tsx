import { createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowBack } from "@mui/icons-material";
import { AccountIcons, userEndpoints } from "@/store/constants/account";
import CustomLink from "@/components/links/CustomLink";
import UserDetailCard from "@/containers/cards/UserDetailCard";
import StatusWrapper from "@/components/layout/StatusWrapper";
import { errorUtils } from "@/store/utils/error";
import type { TRouteLoaderData } from "@/store/types/router";
import type { TUser } from "@/store/types/account";

export const Route = createFileRoute("/app/admin/users/$id")({
  loader: async ({ context, params }): Promise<TRouteLoaderData<TUser>> => {
    try {
      const userId = parseInt(params.id);
      if (isNaN(userId)) throw new Error("Invalid user ID");

      const user = await context.queryClient.fetchQuery({
        queryKey: userEndpoints.user(userId).id,
        queryFn: userEndpoints.user(userId).get,
      });

      return {
        data: user,
        crumb: { label: user.username, Icon: AccountIcons.users.Detail },
      };
    } catch (error) {
      throw notFound({ data: errorUtils.getErrorMessage(error) });
    }
  },
  component: RouteComponent,
  pendingComponent: () => <StatusWrapper loading="loading user..." />,
  notFoundComponent: () => (
    <StatusWrapper
      error={{
        label: "User not found :(",
        actions: [<CustomLink label="Back" icon={<ArrowBack />} to=".." />],
      }}
    />
  ),
});

function RouteComponent() {
  /** Values */

  const loaderData = Route.useLoaderData();

  return <UserDetailCard user={loaderData.data} />;
}
