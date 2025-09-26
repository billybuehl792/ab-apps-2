import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/app/")({
  beforeLoad: () =>
    redirect({ to: "/app/dashboard", replace: true, throw: true }),
});
