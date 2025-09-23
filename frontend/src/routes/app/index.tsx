import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Container, Stack, Typography } from "@mui/material";
import { clientQueries } from "@/store/queries/clients";
import { workOrderQueries } from "@/store/queries/work-orders";
import PageHeader from "@/components/layout/PageHeader";
import LinkCard from "@/components/cards/LinkCard";
import { Person, Work } from "@mui/icons-material";

export const Route = createFileRoute("/app/")({
  component: RouteComponent,
});

function RouteComponent() {
  /** Values */

  const clientCountQuery = useQuery(clientQueries.count());
  const workOrderCountQuery = useQuery(workOrderQueries.count());

  return (
    <Stack component={Container} maxWidth="lg" spacing={2}>
      <PageHeader justifyContent="center">
        <Typography variant="h6">Dashboard</Typography>
      </PageHeader>
      <Stack spacing={1}>
        <LinkCard
          title="Clients"
          subtitle={`Total: ${clientCountQuery.data?.count ?? "-"}`}
          Icon={Person}
          linkOptions={{ to: "/app/clients" }}
        />
        <LinkCard
          title="Work Orders"
          subtitle={`Total: ${workOrderCountQuery.data?.count ?? "-"}`}
          Icon={Work}
          linkOptions={{ to: "/app/work-orders" }}
        />
      </Stack>
    </Stack>
  );
}
