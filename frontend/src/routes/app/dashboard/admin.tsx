import { createFileRoute } from "@tanstack/react-router";
import { AdminPanelSettings } from "@mui/icons-material";
import StatusCard from "@/components/cards/StatusCard";
import { UserGroup } from "@/store/enums/account";
import { RouteLoaderData } from "@/store/types/router";

export const Route = createFileRoute("/app/dashboard/admin")({
  beforeLoad: ({ context }) => {
    const isAdmin = context.auth.me?.groups.some((group) =>
      [UserGroup.AbAdmin, UserGroup.CompanyAdmin].includes(group)
    );

    if (!isAdmin)
      throw new Error("Insufficient permissions to access this content.");
  },
  loader: (): RouteLoaderData => ({
    crumb: { label: "Admin", Icon: AdminPanelSettings },
  }),
  errorComponent: ({ error }) => <StatusCard error={error} />,
  notFoundComponent: () => <StatusCard error="Page not found" />,
});
