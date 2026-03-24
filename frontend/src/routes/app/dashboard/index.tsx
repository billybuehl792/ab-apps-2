import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Stack } from "@mui/material";
import { workOrderQueries } from "@/store/queries/work-orders";
import StatusWrapper from "@/components/layout/StatusWrapper";
import { clientEndpoints, ClientIcons } from "@/store/constants/clients";
import { WorkOrderIcons } from "@/store/constants/work-orders";
import ListCard from "@/components/cards/ListCard";
import { placeEndpoints, PlaceIcons } from "@/store/constants/places";

export const Route = createFileRoute("/app/dashboard/")({
  component: RouteComponent,
  pendingComponent: () => <StatusWrapper loading />,
  errorComponent: ({ error }) => <StatusWrapper error={error} />,
});

function RouteComponent() {
  /** Queries */

  const placeListQuery = useQuery({
    queryKey: placeEndpoints.id,
    queryFn: () => placeEndpoints.get(),
  });
  const clientListQuery = useQuery({
    queryKey: clientEndpoints.id,
    queryFn: () => clientEndpoints.get(),
  });
  const workOrderListQuery = useQuery(workOrderQueries.count());

  return (
    <Stack spacing={1} my={2}>
      <ListCard
        startContent={<PlaceIcons.List fontSize="large" color="disabled" />}
        label="Places"
        description={`Total: ${placeListQuery.data?.count ?? "-"}`}
        link={{ to: "/app/dashboard/places" }}
      />
      <ListCard
        startContent={<ClientIcons.List fontSize="large" color="disabled" />}
        label="Clients"
        description={`Total: ${clientListQuery.data?.count ?? "-"}`}
        link={{ to: "/app/dashboard/clients" }}
      />
      <ListCard
        startContent={<WorkOrderIcons.List fontSize="large" color="disabled" />}
        label="Work Orders"
        description={`Total: ${workOrderListQuery.data?.count ?? "-"}`}
        link={{ to: "/app/dashboard/work-orders" }}
      />
    </Stack>
  );
}
