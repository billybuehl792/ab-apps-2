import { createFileRoute } from "@tanstack/react-router";
import { ClientIcons } from "@/store/constants/clients";
import type { TRouteLoaderData } from "@/store/types/router";

export const Route = createFileRoute("/app/dashboard/clients")({
  loader: (): TRouteLoaderData => ({
    crumb: { label: "Clients", Icon: ClientIcons.List },
  }),
});
