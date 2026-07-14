import { createFileRoute } from "@tanstack/react-router";
import { AccountIcons } from "@/store/constants/account";
import Breadcrumb from "@/components/links/Breadcrumb";

export const Route = createFileRoute("/app/admin/users")({
  staticData: {
    crumb: {
      id: "/app/admin/users",
      Component: () => (
        <Breadcrumb
          to="/app/admin/users"
          children="Users"
          startIcon={<AccountIcons.users.List />}
        />
      ),
    },
  },
});
