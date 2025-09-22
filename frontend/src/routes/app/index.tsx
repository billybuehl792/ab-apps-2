import { createFileRoute } from "@tanstack/react-router";
import { Container, Stack, Typography } from "@mui/material";
import WorkOrderCountCard from "@/containers/cards/WorkOrderCountCard";
import ClientCountCard from "@/containers/cards/ClientCountCard";
import PageHeader from "@/components/layout/PageHeader";

export const Route = createFileRoute("/app/")({
  component: RouteComponent,
});

function RouteComponent() {
  /** Values */

  return (
    <Stack component={Container} maxWidth="lg" spacing={2}>
      <PageHeader justifyContent="center">
        <Typography variant="h6">Dashboard</Typography>
      </PageHeader>
      <Stack spacing={1}>
        <WorkOrderCountCard />
        <ClientCountCard />
      </Stack>
    </Stack>
  );
}
