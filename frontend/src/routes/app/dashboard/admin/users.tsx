import { ADMIN_USERS_ICON } from "@/store/constants/admin";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/dashboard/admin/users")({
  loader: () => {
    const crumb: Crumb = { label: "Users", Icon: ADMIN_USERS_ICON };
    return { crumb };
  },
});
