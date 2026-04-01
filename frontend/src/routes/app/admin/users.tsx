import { createFileRoute } from "@tanstack/react-router";
import { AccountIcons } from "@/store/constants/account";
import type { TRouteLoaderData } from "@/store/types/router";

export const Route = createFileRoute("/app/admin/users")({
  loader: (): TRouteLoaderData => ({
    crumb: { label: "Users", Icon: AccountIcons.users.List },
  }),
});
