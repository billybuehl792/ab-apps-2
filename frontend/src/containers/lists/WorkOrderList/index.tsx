import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Pagination,
  type PaginationProps,
  Skeleton,
  Stack,
  type StackProps,
} from "@mui/material";
import { workOrderQueries } from "@/store/queries/workOrders";
import Link from "@/components/elements/Link";
import StatusCard from "@/components/cards/StatusCard";
import WorkOrderListCard from "@/containers/cards/WorkOrderListCard";

interface WorkOrderListProps extends StackProps {
  params?: Parameters<typeof workOrderQueries.list>[0];
  onPageChange: (page: number) => void;
}

const DEFAULT_PAGE_SIZE = 20;

const WorkOrderList = ({
  params,
  onPageChange,
  ...props
}: WorkOrderListProps) => {
  const [pageCount, setPageCount] = useState(0);

  /** Values */

  const pageSize = params?.page_size ?? DEFAULT_PAGE_SIZE;

  /** Queries */

  const workOrderListQuery = useQuery(workOrderQueries.list(params));

  /** Callbacks */

  const handlePageChange: PaginationProps["onChange"] = (_event, value) =>
    onPageChange(value);

  /** Effects */

  useEffect(() => {
    if (workOrderListQuery.data)
      setPageCount(Math.ceil(workOrderListQuery.data.count / pageSize));
  }, [workOrderListQuery.data, pageSize]);

  return (
    <Stack spacing={1} {...props}>
      {workOrderListQuery.isLoading ? (
        Array.from({ length: pageSize }).map((_, index) => (
          <Skeleton key={index} variant="rounded" height={84} />
        ))
      ) : workOrderListQuery.isSuccess && workOrderListQuery.data.count ? (
        workOrderListQuery.data.results.map((workOrder) => (
          <WorkOrderListCard key={workOrder.id} workOrder={workOrder} />
        ))
      ) : (
        <StatusCard
          error={workOrderListQuery.error}
          {...(workOrderListQuery.data?.count === 0 && {
            empty: "No Work Orders",
            label: (
              <Link label="Create Work Order" to="/app/work-orders/create" />
            ),
          })}
        />
      )}
      {pageCount > 1 && (
        <Stack direction="row" justifyContent="center">
          <Pagination
            count={pageCount}
            {...(pageCount > 10 && {
              showFirstButton: true,
              showLastButton: true,
            })}
            disabled={workOrderListQuery.isLoading}
            page={params?.page ?? 1}
            onChange={handlePageChange}
          />
        </Stack>
      )}
    </Stack>
  );
};

export default WorkOrderList;
