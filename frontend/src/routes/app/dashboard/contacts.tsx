import { createFileRoute } from "@tanstack/react-router";
import { ContactIcons } from "@/store/constants/contacts";
import type { TRouteLoaderData } from "@/store/types/router";

export const Route = createFileRoute("/app/dashboard/contacts")({
  loader: (): TRouteLoaderData => ({
    crumb: { label: "Contacts", Icon: ContactIcons.List },
  }),
});
