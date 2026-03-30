import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { Stack, Typography } from "@mui/material";
import PlaceMapCard from "@/containers/cards/PlaceMapCard";

export const Route = createFileRoute("/app/directory/places/$id/")({
  component: RouteComponent,
});

function RouteComponent() {
  /** Values */

  const loaderData = useLoaderData({ from: "/app/dashboard/places/$id" });

  return (
    <Stack spacing={2}>
      <Typography>{loaderData.data.address_full}</Typography>
      <PlaceMapCard place={loaderData.data} />
    </Stack>
  );
}
