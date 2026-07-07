import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Container, Stack } from "@mui/material";
import ListCard from "@/components/cards/ListCard";
import { usersQueries } from "@/store/queries/account";
import { AccountIcons } from "@/store/constants/account";

export const Route = createFileRoute("/app/admin/")({
  component: RouteComponent,
  beforeLoad: () => ({ crumb: null }),
});

function RouteComponent() {
  /** Values */

  const userListQuery = useQuery(usersQueries.list());

  return (
    <Container>
      <Stack spacing={2} my={2}>
        <ListCard
          label="Users"
          description={`Total: ${userListQuery.data?.count ?? "-"}`}
          startContent={
            <AccountIcons.users.Detail fontSize="large" color="disabled" />
          }
          link={{ to: "/app/admin/users" }}
        />
      </Stack>
    </Container>
  );
}
