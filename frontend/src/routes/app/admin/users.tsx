import { createFileRoute } from "@tanstack/react-router";
import { AccountIcons } from "@/store/constants/account";

export const Route = createFileRoute("/app/admin/users")({
  beforeLoad: () => ({
    crumb: { label: "Users", Icon: AccountIcons.users.List },
  }),
});
