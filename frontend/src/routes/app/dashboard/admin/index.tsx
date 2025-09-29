import { createFileRoute } from "@tanstack/react-router";
import { Stack } from "@mui/material";
import LinkCard from "@/components/cards/LinkCard";
import { useQuery } from "@tanstack/react-query";
import { accountQueries } from "@/store/queries/account";
import { AdminIcons } from "@/store/constants/admin";

export const Route = createFileRoute("/app/dashboard/admin/")({
  component: RouteComponent,
});

function RouteComponent() {
  /** Values */

  const userCountQuery = useQuery(accountQueries.users.count());

  return (
    <Stack spacing={2}>
      <LinkCard
        title="Users"
        subtitle={`Total: ${userCountQuery.data?.count ?? "-"}`}
        Icon={AdminIcons.Users.List}
        linkOptions={{ to: "/app/dashboard/admin/users" }}
      />
    </Stack>
  );
}
