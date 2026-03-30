import { PlaceIcons } from "@/store/constants/places";
import { createFileRoute } from "@tanstack/react-router";
import type { TRouteLoaderData } from "@/store/types/router";

export const Route = createFileRoute("/app/directory/places/create")({
  loader: (): TRouteLoaderData => ({
    crumb: { label: "Create Place", Icon: PlaceIcons.Create },
  }),
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/app/dashboard/places/create"!</div>;
}
