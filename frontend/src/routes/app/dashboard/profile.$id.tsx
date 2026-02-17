import { createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowBack } from "@mui/icons-material";
import { accountQueries } from "@/store/queries/account";
import StatusWrapper from "@/components/layout/StatusWrapper";
import UserDetailCard from "@/containers/cards/UserDetailCard";
import CustomLink from "@/components/links/CustomLink";
import { errorUtils } from "@/store/utils/error";
import { AccountIcons } from "@/store/constants/account";
import type { TRouteLoaderData } from "@/store/types/router";
import type { IUser } from "@/store/types/account";

export const Route = createFileRoute("/app/dashboard/profile/$id")({
  loader: async ({ context, params }): Promise<TRouteLoaderData<IUser>> => {
    try {
      if (isNaN(Number(params.id))) throw new Error("Invalid user ID");

      const user = await context.queryClient.fetchQuery(
        accountQueries.users.detail(Number(params.id)),
      );

      return {
        data: user,
        crumb: { label: user.username, Icon: AccountIcons.Detail },
      };
    } catch (error) {
      throw notFound({ data: errorUtils.getErrorMessage(error) });
    }
  },
  component: RouteComponent,
  pendingComponent: () => <StatusWrapper loading="loading user..." m={2} />,
  errorComponent: ({ error }) => <StatusWrapper error={error} m={2} />,
  notFoundComponent: () => (
    <StatusWrapper
      error={{
        label: "User not found :(",
        actions: [<CustomLink label="Back" icon={<ArrowBack />} to=".." />],
      }}
      m={2}
    />
  ),
});

function RouteComponent() {
  /** Values */

  const loaderData = Route.useLoaderData();

  return <UserDetailCard user={loaderData.data} />;
}
