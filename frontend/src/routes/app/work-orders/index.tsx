import { createFileRoute, useNavigate } from "@tanstack/react-router";
import PaginatedList from "@/components/lists/PaginatedList";
import { workOrderQueries } from "@/store/queries/work-orders";
import { paramUtils } from "@/store/utils/params";
import WorkOrderListCard from "@/containers/cards/WorkOrderListCard";
import { PAGE_HEADER_HEIGHT } from "@/store/constants/layout";
import type { WorkOrderApiListRequest } from "@/store/types/work-orders";

const cleanParams = (params: Record<string, unknown>) =>
  paramUtils.cleanApiListRequestParams<WorkOrderApiListRequest>(params);

export const Route = createFileRoute("/app/work-orders/")({
  validateSearch: cleanParams,
  component: RouteComponent,
});

function RouteComponent() {
  /** Values */

  const params = Route.useSearch();
  const navigate = useNavigate();

  const queryOptions = workOrderQueries.list(params);

  /** Callbacks */

  const handlePageChange = (page: number) =>
    navigate({
      to: "/app/work-orders",
      search: cleanParams({ ...params, page }),
    });

  const handleSearch = (term: string) =>
    navigate({
      to: "/app/work-orders",
      search: cleanParams({ ...params, page: 1, search: term }),
    });

  return (
    <PaginatedList
      queryOptions={queryOptions}
      renderItem={(workOrder) => (
        <WorkOrderListCard key={workOrder.id} workOrder={workOrder} />
      )}
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
