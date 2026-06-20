import { Container, Stack } from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/admin/users/create")({
  component: RouteComponent,
  beforeLoad: () => ({ crumb: { label: "Create" } }),
});

function RouteComponent() {
  return (
    <Container sx={{ mt: 2 }}>
      <Stack>TODO: Add User Create</Stack>
    </Container>
  );
}
