import { createFileRoute } from "@tanstack/react-router";
import StatusWrapper from "@/components/layout/StatusWrapper";
import { AdminPanelSettings } from "@mui/icons-material";
import { EUserGroup } from "@/store/enums/account";
import type { TRouteLoaderData } from "@/store/types/router";

export const Route = createFileRoute("/app/admin")({
  beforeLoad: ({ context }) => {
    const isAdmin = context.auth.me?.groups.some((group) =>
      [EUserGroup.AbAdmin, EUserGroup.CompanyAdmin].includes(group),
    );

    if (!isAdmin)
      throw new Error("Insufficient permissions to access this content.");
  },
  loader: (): TRouteLoaderData => ({
    crumb: { label: "Admin", Icon: AdminPanelSettings },
  }),
  errorComponent: ({ error }) => <StatusWrapper error={error} />,
  notFoundComponent: () => <StatusWrapper error="Page not found" />,
});
