import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Stack } from "@mui/material";
import { userEndpoints } from "@/store/constants/account";
import ListCard from "@/components/cards/ListCard";
import { AdminIcons } from "@/store/constants/admin";

export const Route = createFileRoute("/app/dashboard/admin/")({
  component: RouteComponent,
});

function RouteComponent() {
  /** Values */

  const userCountQuery = useQuery({
    queryKey: userEndpoints.id,
    queryFn: () => userEndpoints.get(),
  });

  return (
    <Stack spacing={2} my={2}>
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
