import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { paramUtils } from "@/store/utils/params";
import { accountQueries } from "@/store/queries/account";
import PaginatedList from "@/components/lists/PaginatedList";
import UserListCard from "@/containers/cards/UserListCard";
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
    <PaginatedList
      queryOptions={queryOptions}
      renderItem={(user) => <UserListCard key={user.id} user={user} />}
      onPageChange={(page) => handleParamsChange({ ...params, page })}
      sx={{ p: 2 }}
    />
  );
}
