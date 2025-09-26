import { createFileRoute } from "@tanstack/react-router";
import { AdminPanelSettings } from "@mui/icons-material";
import StatusCard from "@/components/cards/StatusCard";
import { UserGroup } from "@/store/enums/account";

export const Route = createFileRoute("/app/dashboard/admin")({
  beforeLoad: ({ context }) => {
    const isAdmin = context.auth.me?.groups.some((group) =>
      [UserGroup.AbAdmin, UserGroup.CompanyAdmin].includes(group)
    );

    if (!isAdmin)
      throw new Error("Insufficient permissions to access this content.");
  },
  loader: () => {
    const crumb: Crumb = { label: "Admin", Icon: AdminPanelSettings };
    return { crumb };
  },
  errorComponent: ({ error }) => <StatusCard error={error} />,
  notFoundComponent: () => <StatusCard error="Page not found" />,
});
