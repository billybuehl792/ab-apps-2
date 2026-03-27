import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Container, Typography } from "@mui/material";
import PageHeader from "@/components/layout/PageHeader";

export const Route = createFileRoute("/app/directory")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Container maxWidth="md">
      <PageHeader title={<Typography variant="h4">Directory</Typography>} />
      <Outlet />
    </Container>
  );
}
