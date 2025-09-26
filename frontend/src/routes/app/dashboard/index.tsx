import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Stack } from "@mui/material";
import { clientQueries } from "@/store/queries/clients";
import { workOrderQueries } from "@/store/queries/work-orders";
import LinkCard from "@/components/cards/LinkCard";
import { CLIENTS_ICON } from "@/store/constants/clients";
import { WORK_ORDERS_ICON } from "@/store/constants/work-orders";

export const Route = createFileRoute("/app/dashboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  /** Values */

  const clientCountQuery = useQuery(clientQueries.count());
  const workOrderCountQuery = useQuery(workOrderQueries.count());

  return (
    <Stack spacing={1}>
      <LinkCard
        title="Clients"
        subtitle={`Total: ${clientCountQuery.data?.count ?? "-"}`}
        Icon={CLIENTS_ICON}
        linkOptions={{ to: "/app/dashboard/clients" }}
      />
      <LinkCard
        title="Work Orders"
        subtitle={`Total: ${workOrderCountQuery.data?.count ?? "-"}`}
        Icon={WORK_ORDERS_ICON}
        linkOptions={{ to: "/app/dashboard/work-orders" }}
      />
    </Stack>
  );
}
