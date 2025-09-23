import { createFileRoute } from "@tanstack/react-router";
import { Stack } from "@mui/material";
import LinkCard from "@/components/cards/LinkCard";
import { Person } from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import { accountQueries } from "@/store/queries/account";

export const Route = createFileRoute("/app/admin/")({
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
        Icon={Person}
        linkOptions={{ to: "/app/admin/users" }}
      />
    </Stack>
  );
}
