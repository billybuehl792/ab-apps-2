import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/admin/users")({
  loader: () => ({ crumb: "Users" }),
});
