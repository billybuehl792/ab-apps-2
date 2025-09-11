import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/admin/users/create")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/app/profile/create"!</div>;
}
