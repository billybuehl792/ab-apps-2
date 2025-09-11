import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/app/admin")({
  component: RouteComponent,
  beforeLoad: () => {
    // TODO: Check if me.groups includes AbAdmin or CompanyAdmin
    // If not, redirect to /app
  },
});

function RouteComponent() {
  return <Outlet />;
}
