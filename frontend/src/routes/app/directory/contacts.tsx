import { ContactIcons } from "@/store/constants/contacts";
import { createFileRoute } from "@tanstack/react-router";
import type { TRouteLoaderData } from "@/store/types/router";

export const Route = createFileRoute("/app/directory/contacts")({
  loader: (): TRouteLoaderData => ({
    crumb: { label: "Contacts", Icon: ContactIcons.List },
  }),
});
