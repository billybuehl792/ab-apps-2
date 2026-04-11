import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/board/jobs/create")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/app/board/jobs/create"!</div>;
}
