import { createFileRoute } from "@tanstack/react-router";
import { Stack } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { accountQueries } from "@/store/queries/account";
import { AdminIcons } from "@/store/constants/admin";
import ListCard from "@/components/cards/ListCard";

export const Route = createFileRoute("/app/dashboard/admin/")({
  component: RouteComponent,
});

function RouteComponent() {
  /** Values */

  const userCountQuery = useQuery(accountQueries.users.count());

  return (
    <Stack spacing={2}>
      <ListCard
        label="Users"
        description={`Total: ${userCountQuery.data?.count ?? "-"}`}
        startContent={
          <AdminIcons.Users.List fontSize="large" color="disabled" />
        }
        link={{ to: "/app/dashboard/admin/users" }}
      />
    </Stack>
  );
}
