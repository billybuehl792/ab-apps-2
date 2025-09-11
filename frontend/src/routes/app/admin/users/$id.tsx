import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/admin/users/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/app/users/$id"!</div>;
}
