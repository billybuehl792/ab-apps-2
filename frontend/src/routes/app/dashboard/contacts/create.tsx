import { createFileRoute } from "@tanstack/react-router";
import type { TRouteLoaderData } from "@/store/types/router";
import { ContactIcons } from "@/store/constants/contacts";

export const Route = createFileRoute("/app/dashboard/contacts/create")({
  loader: (): TRouteLoaderData => ({
    crumb: { label: "Create Contact", Icon: ContactIcons.Create },
  }),
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/app/dashboard/contacts/create"!</div>;
}
