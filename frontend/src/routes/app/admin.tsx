import { createFileRoute } from "@tanstack/react-router";
import { AdminPanelSettings } from "@mui/icons-material";
import { EUserGroup } from "@/store/enums/account";

export const Route = createFileRoute("/app/admin")({
  beforeLoad: ({ context }) => {
    const isAdmin = context.auth.me?.groups.some((group) =>
      [EUserGroup.AbAdmin, EUserGroup.CompanyAdmin].includes(group),
    );
    if (!isAdmin)
      throw new Error("Insufficient permissions to access this content.");

    return { crumb: { label: "Admin", Icon: AdminPanelSettings } };
  },
});
