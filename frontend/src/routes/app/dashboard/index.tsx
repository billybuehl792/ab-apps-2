import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Stack } from "@mui/material";
import { workOrderQueries } from "@/store/queries/work-orders";
import StatusWrapper from "@/components/layout/StatusWrapper";
import { clientEndpoints, ClientIcons } from "@/store/constants/clients";
import { WorkOrderIcons } from "@/store/constants/work-orders";
import ListCard from "@/components/cards/ListCard";

export const Route = createFileRoute("/app/dashboard/")({
  component: RouteComponent,
  pendingComponent: () => <StatusWrapper loading />,
  errorComponent: ({ error }) => <StatusWrapper error={error} />,
});

function RouteComponent() {
  /** Values */

  const clientCountQuery = useQuery({
    queryKey: clientEndpoints.id,
    queryFn: () => clientEndpoints.get(),
  });
  const workOrderCountQuery = useQuery(workOrderQueries.count());

  return (
    <Stack spacing={1} my={2}>
      <ListCard
        startContent={<ClientIcons.List fontSize="large" color="disabled" />}
        label="Clients"
        description={`Total: ${clientCountQuery.data?.count ?? "-"}`}
        link={{ to: "/app/dashboard/clients" }}
      />
      <ListCard
        startContent={<WorkOrderIcons.List fontSize="large" color="disabled" />}
        label="Work Orders"
        description={`Total: ${workOrderCountQuery.data?.count ?? "-"}`}
        link={{ to: "/app/dashboard/work-orders" }}
      />
    </Stack>
  );
}
