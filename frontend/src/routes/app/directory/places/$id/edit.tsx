import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/directory/places/$id/edit")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/app/directory/places/$id/edit"!</div>;
}
