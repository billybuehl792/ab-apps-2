import { createFileRoute, useLoaderData } from "@tanstack/react-router";

export const Route = createFileRoute("/app/contacts/$id/")({
  component: RouteComponent,
});

function RouteComponent() {
  /** Values */

  const loaderData = useLoaderData({ from: "/app/contacts/$id" });
  const contact = loaderData.contact;

  return `Contact ${contact.first_name} ${contact.last_name}`;
}
