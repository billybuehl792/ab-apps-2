import { createFileRoute, notFound } from "@tanstack/react-router";
import { Container, Stack, Typography } from "@mui/material";
import PageHeader from "@/components/layout/PageHeader";
import StatusWrapper from "@/components/layout/StatusWrapper";
import UserDetailCard from "@/containers/cards/UserDetailCard";
import PageNotFoundCard from "@/components/cards/PageNotFoundCard";
import { AccountIcons, userEndpoints } from "@/store/constants/account";
import { errorUtils } from "@/store/utils/error";
import type { TRouteLoaderData } from "@/store/types/router";
import type { TUser } from "@/store/types/account";

export const Route = createFileRoute("/app/profile/$id")({
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
  pendingComponent: () => <StatusWrapper loading="loading user..." m={2} />,
  errorComponent: ({ error }) => <StatusWrapper error={error} m={2} />,
  notFoundComponent: () => <PageNotFoundCard m={2} />,
});

function RouteComponent() {
  /** Values */

  const loaderData = Route.useLoaderData();

  return (
    <Container maxWidth="md">
      <PageHeader title={<Typography variant="h4">Profile</Typography>} />
      <Stack mt={2}>
        <UserDetailCard user={loaderData.data} />
      </Stack>
    </Container>
  );
}
