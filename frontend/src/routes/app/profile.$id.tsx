import { createFileRoute, notFound } from "@tanstack/react-router";
import { Container, Stack } from "@mui/material";
import UserDetailCard from "@/containers/cards/UserDetailCard";
import { errorUtils } from "@/store/utils/error";
import { AccountIcons } from "@/store/constants/account";
import { accountQueries } from "@/store/queries/account";

export const Route = createFileRoute("/app/profile/$id")({
  beforeLoad: async ({ context, params }) => {
    try {
      const id = Number(params.id);
      if (isNaN(id)) throw new Error("Invalid user ID");
      const user = await context.queryClient.fetchQuery(
        accountQueries.users.user(id).detail,
      );
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

  const context = Route.useRouteContext();

  return (
    <Container>
      <Stack mt={2}>
        <UserDetailCard user={context.user} />
      </Stack>
    </Container>
  );
}
