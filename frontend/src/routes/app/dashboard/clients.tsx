import { createFileRoute } from "@tanstack/react-router";
import { CLIENTS_ICON } from "@/store/constants/clients";
import type { RouteLoaderData } from "@/store/types/router";

export const Route = createFileRoute("/app/dashboard/clients")({
  loader: (): RouteLoaderData => ({
    crumb: { label: "Clients", Icon: CLIENTS_ICON },
  }),
});
