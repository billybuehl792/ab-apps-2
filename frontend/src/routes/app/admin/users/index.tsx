import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { paramUtils } from "@/store/utils/params";
import { accountQueries } from "@/store/queries/account";
import PaginatedList from "@/components/lists/PaginatedList";
import UserListCard from "@/containers/cards/UserListCard";
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

  const handlePageChange = (page: number) =>
    navigate({
      to: "/app/admin/users",
      search: cleanParams({ ...params, page }),
    });

  const handleSearch = (term: string) =>
    navigate({
      to: "/app/admin/users",
      search: cleanParams({ ...params, page: 1, search: term }),
    });

  return (
    <PaginatedList
      queryOptions={queryOptions}
      renderItem={(user) => <UserListCard key={user.id} user={user} />}
      onPageChange={handlePageChange}
      onSearch={handleSearch}
      sx={{ p: 2, pt: 0 }}
      slotProps={{
        header: {
          position: "sticky",
          top: PAGE_HEADER_HEIGHT,
          pt: 2,
          bgcolor: (theme) => theme.palette.background.paper,
          zIndex: 1,
        },
      }}
    />
  );
}
