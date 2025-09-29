import { createFileRoute } from "@tanstack/react-router";
import { ADMIN_USERS_ICON } from "@/store/constants/admin";
import type { RouteLoaderData } from "@/store/types/router";

export const Route = createFileRoute("/app/dashboard/admin/users")({
  loader: (): RouteLoaderData => ({
    crumb: { label: "Users", Icon: ADMIN_USERS_ICON },
  }),
});
