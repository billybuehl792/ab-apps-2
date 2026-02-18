import { createFileRoute, notFound } from "@tanstack/react-router";
import { Stack } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import StatusWrapper from "@/components/layout/StatusWrapper";
import UserDetailCard from "@/containers/cards/UserDetailCard";
import CustomLink from "@/components/links/CustomLink";
import { AccountIcons, userEndpoints } from "@/store/constants/account";
import { errorUtils } from "@/store/utils/error";
import type { TRouteLoaderData } from "@/store/types/router";
import type { TUser } from "@/store/types/account";

export const Route = createFileRoute("/app/dashboard/profile/$id")({
  loader: async ({ context, params }): Promise<TRouteLoaderData<TUser>> => {
    try {
      const userId = parseInt(params.id, 10);
      if (isNaN(userId)) throw new Error("Invalid user ID");

      const user = await context.queryClient.fetchQuery({
        queryKey: userEndpoints.user(userId).id,
        queryFn: userEndpoints.user(userId).get,
      });

      return {
        data: user,
        crumb: { label: user.username, Icon: AccountIcons.Detail },
      };
    } catch (error) {
      throw notFound({ data: errorUtils.getErrorMessage(error) });
    }
  },
  component: RouteComponent,
  pendingComponent: () => <StatusWrapper loading="loading user..." my={2} />,
  errorComponent: ({ error }) => <StatusWrapper error={error} my={2} />,
  notFoundComponent: () => (
    <StatusWrapper
      error={{
        label: "User not found :(",
        actions: [<CustomLink label="Back" icon={<ArrowBack />} to=".." />],
      }}
      my={2}
    />
  ),
});

function RouteComponent() {
  /** Values */

  const loaderData = Route.useLoaderData();

  return (
    <Stack my={2}>
      <UserDetailCard user={loaderData.data} />
    </Stack>
  );
}
