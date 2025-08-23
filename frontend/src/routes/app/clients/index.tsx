import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Skeleton, Stack } from "@mui/material";
import { clientQueries } from "@/store/queries/clients";
import ClientListCard from "@/containers/cards/ClientListCard";

export const Route = createFileRoute("/app/clients/")({
  component: RouteComponent,
});

function RouteComponent() {
  /** Queries */

  const clientListQuery = useQuery(clientQueries.list());

  return (
    <Stack spacing={1}>
      {clientListQuery.isLoading
        ? Array.from({ length: 10 }).map((_, index) => (
            <Skeleton key={index} variant="rounded" height={100} />
          ))
        : clientListQuery.data?.results.map((client) => (
            <ClientListCard key={client.id} client={client} />
          ))}
    </Stack>
  );
}
