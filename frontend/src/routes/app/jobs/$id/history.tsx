import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/jobs/$id/history")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/app/jobs/$id/history"!</div>;
}
