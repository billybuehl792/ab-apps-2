import { type ComponentProps } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Pagination,
  type PaginationProps,
  Skeleton,
  Stack,
  type StackProps,
} from "@mui/material";
import { workOrderQueries } from "@/store/queries/work-orders";
import WorkOrderListCard from "../cards/WorkOrderListCard";
import StatusCard from "@/components/cards/StatusCard";
import { sxUtils } from "@/store/utils/sx";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/store/constants/api";
import type { WorkOrderListRequestParams } from "@/store/types/work-orders";

interface WorkOrderListPaginatedListProps extends StackProps {
  params: WorkOrderListRequestParams;
  empty?: ComponentProps<typeof StatusCard>["empty"];
  onPageChange: (page: number) => void;
  slotProps?: {
    card?: Partial<Omit<ComponentProps<typeof WorkOrderListCard>, "workOrder">>;
    skeletonCard?: Partial<ComponentProps<typeof Skeleton>>;
    pagination?: Partial<
      Omit<PaginationProps, "count" | "page" | "onChange" | "disabled">
    >;
  };
}

const WorkOrderListPaginatedList = ({
  params,
  empty = "No work orders found.",
  onPageChange,
  slotProps,
  ...props
}: WorkOrderListPaginatedListProps) => {
  /** Values */

  const page = params.page ?? DEFAULT_PAGE;
  const pageSize = params.page_size ?? DEFAULT_PAGE_SIZE;

  /** Queries */

  const workOrderListQuery = useQuery(workOrderQueries.list(params));

  /** Data */

  const pageCount = workOrderListQuery.isSuccess
    ? Math.ceil(workOrderListQuery.data.count / pageSize)
    : 0;

  /** Callbacks */

  const handlePageChange: PaginationProps["onChange"] = (_event, page) =>
    onPageChange(page);

  return (
    <Stack spacing={1} {...props}>
      {workOrderListQuery.isLoading ? (
        Array.from({ length: pageSize }).map((_, index) => (
          <Skeleton
            key={index}
            variant="rounded"
            height={84}
            {...slotProps?.skeletonCard}
          />
        ))
      ) : workOrderListQuery.isSuccess && workOrderListQuery.data.count ? (
        workOrderListQuery.data.results.map((workOrder) => (
          <WorkOrderListCard
            key={workOrder.id}
            workOrder={workOrder}
            {...slotProps?.card}
          />
        ))
      ) : (
        <StatusCard
          error={workOrderListQuery.error}
          empty={workOrderListQuery.data?.count === 0 && empty}
        />
      )}
      {pageCount > 1 && (
        <Pagination
          count={pageCount}
          disabled={workOrderListQuery.isLoading}
          page={page}
          showFirstButton={pageCount > 10}
          showLastButton={pageCount > 10}
          onChange={handlePageChange}
          {...slotProps?.pagination}
          sx={[
            { alignSelf: "center" },
            ...sxUtils.asArray(slotProps?.pagination?.sx),
          ]}
        />
      )}
    </Stack>
  );
};

export default WorkOrderListPaginatedList;
