import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { accountQueries } from "@/store/queries/account";
import UserListCard from "@/containers/cards/UserListCard";
import PaginatedQueryList from "@/components/lists/PaginatedQueryList";
import { paramUtils } from "@/store/utils/params";
import { PAGE_HEADER_HEIGHT } from "@/store/constants/layout";
import type { UserApiListRequest } from "@/store/types/account";

const cleanParams = (params: Record<string, unknown>) =>
  paramUtils.cleanApiListRequestParams<UserApiListRequest>(params);

export const Route = createFileRoute("/app/admin/users/")({
  validateSearch: cleanParams,
  component: RouteComponent,
});

function RouteComponent() {
  /** Values */

  const params = Route.useSearch();
  const navigate = useNavigate();

  const queryOptions = accountQueries.users.list(params);

  /** Callbacks */

  const handleParamsChange = (newParams: UserApiListRequest) =>
    navigate({ to: "/app/admin/users", search: cleanParams(newParams) });

  return (
    <PaginatedQueryList
      queryOptions={queryOptions}
      renderItem={(user) => <UserListCard key={user.id} user={user} />}
      onParamsChange={handleParamsChange}
      slotProps={{
        header: {
          position: "sticky",
          top: PAGE_HEADER_HEIGHT + 16,
          zIndex: 2,
          bgcolor: "background.paper",
          boxShadow: (theme) =>
            `0px -${PAGE_HEADER_HEIGHT / 4}px ${theme.palette.background.paper}`,
        },
      }}
    />
  );
}
