import { createFileRoute, useLoaderData } from "@tanstack/react-router";

export const Route = createFileRoute("/app/dashboard/places/$id/")({
  component: RouteComponent,
});

function RouteComponent() {
  /** Values */

  const loaderData = useLoaderData({ from: "/app/dashboard/places/$id" });

  return <div>{loaderData.data.address_full}</div>;
}
