import { createFileRoute, notFound } from "@tanstack/react-router";
import { AccountIcons, userEndpoints } from "@/store/constants/account";
import UserDetailCard from "@/containers/cards/UserDetailCard";
import StatusWrapper from "@/components/layout/StatusWrapper";
import { errorUtils } from "@/store/utils/error";
import { idSchema } from "@/store/schemas/basic";
import type { TRouteLoaderData } from "@/store/types/router";
import type { TUser } from "@/store/types/account";

export const Route = createFileRoute("/app/admin/users/$id")({
  loader: async ({ context, params }): Promise<TRouteLoaderData<TUser>> => {
    try {
      const userId = idSchema.parse(params.id);
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
});

function RouteComponent() {
  /** Values */

  const loaderData = Route.useLoaderData();

  return <UserDetailCard user={loaderData.data} />;
}
