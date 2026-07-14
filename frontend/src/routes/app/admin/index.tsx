import { createFileRoute } from "@tanstack/react-router";
import { Container, Stack } from "@mui/material";
import ListCard from "@/components/cards/ListCard";
import { AccountIcons } from "@/store/constants/account";

export const Route = createFileRoute("/app/admin/")({
  component: RouteComponent,
});

function RouteComponent() {
  /** Values */

  return (
    <Container>
      <Stack spacing={2} my={2}>
        <ListCard
          label="Users"
          startContent={
            <AccountIcons.users.Detail fontSize="large" color="disabled" />
          }
          link={{ to: "/app/admin/users" }}
        />
      </Stack>
    </Container>
  );
}
