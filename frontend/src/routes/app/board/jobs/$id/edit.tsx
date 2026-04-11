import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/board/jobs/$id/edit")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/app/board/jobs/$id/edit"!</div>;
}
