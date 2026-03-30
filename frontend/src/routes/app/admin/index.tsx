import ListCard from "@/components/cards/ListCard";
import { AccountIcons, userEndpoints } from "@/store/constants/account";
import { Stack } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/admin/")({
  component: RouteComponent,
});

function RouteComponent() {
  /** Values */

  const userListQuery = useQuery({
    queryKey: userEndpoints.id,
    queryFn: () => userEndpoints.get(),
  });

  return (
    <Stack spacing={2} my={2}>
      <ListCard
        label="Users"
        description={`Total: ${userListQuery.data?.count ?? "-"}`}
        startContent={
          <AccountIcons.users.Detail fontSize="large" color="disabled" />
        }
        link={{ to: "/app/admin/users" }}
      />
    </Stack>
  );
}
