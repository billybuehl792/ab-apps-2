import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { accountQueries } from "@/store/queries/account";
import UserListCard from "@/containers/cards/UserListCard";
import PaginatedQueryList from "@/components/lists/PaginatedQueryList";
import { paramUtils } from "@/store/utils/params";
import { page } from "@/store/constants/layout";
import type { UserListRequestParams } from "@/store/types/account";

const cleanParams = (params: Record<string, unknown>) =>
  paramUtils.cleanListRequestParamsParams<UserListRequestParams>(params);

export const Route = createFileRoute("/app/dashboard/admin/users/")({
  validateSearch: cleanParams,
  component: RouteComponent,
});

function RouteComponent() {
  /** Values */

  const params = Route.useSearch();
  const navigate = useNavigate();

  const queryOptions = accountQueries.users.list(params);

  /** Callbacks */

  const handleParamsChange = (newParams: UserListRequestParams) =>
    navigate({
      to: "/app/dashboard/admin/users",
      search: cleanParams(newParams),
    });

  return (
    <PaginatedQueryList
      queryOptions={queryOptions}
      renderItem={(user) => <UserListCard key={user.id} user={user} />}
      onParamsChange={handleParamsChange}
      slotProps={{
        header: {
          position: "sticky",
          top: page.header.height + 16,
          zIndex: 2,
          bgcolor: "background.paper",
          boxShadow: (theme) =>
            `0px -${page.header.height / 4}px ${theme.palette.background.paper}`,
        },
      }}
    />
  );
}
