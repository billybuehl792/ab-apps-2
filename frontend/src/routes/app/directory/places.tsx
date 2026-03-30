import { createFileRoute } from "@tanstack/react-router";
import { PlaceIcons } from "@/store/constants/places";
import type { TRouteLoaderData } from "@/store/types/router";

export const Route = createFileRoute("/app/directory/places")({
  loader: (): TRouteLoaderData => ({
    crumb: { label: "Places", Icon: PlaceIcons.List },
  }),
});
