import StatusCard from "@/components/cards/StatusCard";
import { UserGroup } from "@/store/enums/account";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/app/admin")({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    if (
      !context.auth.me?.groups.some((group) =>
        [UserGroup.AbAdmin, UserGroup.CompanyAdmin].includes(group)
      )
    )
      throw new Error("Insufficient permissions to access this content.");
  },
  errorComponent: ({ error }) => <StatusCard error={error} m={2} />,
});

function RouteComponent() {
  return <Outlet />;
}
