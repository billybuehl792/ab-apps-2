import { createFileRoute, notFound } from "@tanstack/react-router";
import { Container, Stack } from "@mui/material";
import UserDetailCard from "@/containers/cards/UserDetailCard";
import { AccountIcons, userEndpoints } from "@/store/constants/account";
import { errorUtils } from "@/store/utils/error";

export const Route = createFileRoute("/app/profile/$id")({
  beforeLoad: async ({ context, params }) => {
    try {
      const userId = parseInt(params.id, 10);
      if (isNaN(userId)) throw new Error("Invalid user ID");

      const user = await context.queryClient.fetchQuery({
        queryKey: userEndpoints.user(userId).id,
        queryFn: userEndpoints.user(userId).get,
      });
      return {
        user,
        crumb: { label: user.username, Icon: AccountIcons.Detail },
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

  return (
    <Container>
      <Stack mt={2}>
        <UserDetailCard user={user} />
      </Stack>
    </Container>
  );
}
