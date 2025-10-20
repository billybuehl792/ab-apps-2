import { useQuery } from "@tanstack/react-query";
import {
  Pagination,
  type PaginationProps,
  Skeleton,
  Stack,
  type StackProps,
} from "@mui/material";
import { workOrderQueries } from "@/store/queries/work-orders";
import { workOrderListParamsSchema } from "@/store/schemas/work-orders";
import DebouncedSearchField from "@/components/fields/DebouncedSearchField";
import StatusCard from "@/components/cards/StatusCard";
import WorkOrderListCard from "@/containers/lists/WorkOrderList/components/cards/WorkOrderListCard";
import WorkOrderListParamsFormIconButton from "./components/buttons/WorkOrderListParamsFormIconButton";
import WorkOrderListParamsChipList from "./components/layout/WorkOrderListParamsChipList";
import { objectUtils } from "@/store/utils/object";
import { sxUtils } from "@/store/utils/sx";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  DEFAULT_SEARCH,
} from "@/store/constants/api";
import type { WorkOrderListRequestParams } from "@/store/types/work-orders";

interface WorkOrderListProps extends StackProps {
  params: WorkOrderListRequestParams;
  /** If provided, these params will be included in all queries */
  baseParams?: Pick<WorkOrderListRequestParams, "client" | "status" | "city">;
  hideSearch?: boolean;
  hideFilters?: boolean;
  onParamsChange: (params: WorkOrderListRequestParams) => void;
  slotProps?: {
    header?: StackProps;
    list?: StackProps;
    pagination?: Partial<
      Omit<PaginationProps, "count" | "page" | "onChange" | "disabled">
    >;
  };
}

const WorkOrderList = ({
  params,
  baseParams,
  hideSearch,
  hideFilters,
  onParamsChange,
  slotProps,
  ...props
}: WorkOrderListProps) => {
  /** Values */

  const sanitizedParams = baseParams
    ? (Object.fromEntries(
        Object.entries(params).filter(([key]) => !(key in baseParams))
      ) as WorkOrderListRequestParams)
    : params;

  const page = sanitizedParams.page ?? DEFAULT_PAGE;
  const pageSize = sanitizedParams.page_size ?? DEFAULT_PAGE_SIZE;
  const search = sanitizedParams.search ?? DEFAULT_SEARCH;

  const showHeader = !hideSearch || !hideFilters;

  /** Queries */

  const workOrderListQuery = useQuery(
    workOrderQueries.list({ ...sanitizedParams, ...baseParams })
  );

  /** Data */

  const pageCount = workOrderListQuery.isSuccess
    ? Math.ceil(workOrderListQuery.data.count / pageSize)
    : 0;

  /** Callbacks */

  const handleOnParamsChange = (newParams: WorkOrderListRequestParams) =>
    onParamsChange(
      objectUtils.deepSanitizeObject({
        ...workOrderListParamsSchema.parse(newParams),
        ...baseParams,
      })
    );

  const handlePageChange = (page: number) =>
    handleOnParamsChange({ ...sanitizedParams, page });

  const handleOnSearch = (term: string) =>
    handleOnParamsChange({ ...sanitizedParams, page: undefined, search: term });

  const handleOnFilterChange = (newParams: WorkOrderListRequestParams) =>
    handleOnParamsChange({ ...sanitizedParams, page: undefined, ...newParams });

  return (
    <Stack spacing={2} {...props}>
      {showHeader && (
        <Stack spacing={1} {...slotProps?.header}>
          <Stack direction="row" spacing={1} alignItems="center">
            {!hideSearch && (
              <DebouncedSearchField
                value={search}
                size="small"
                placeholder="Search Work Orders..."
                onSearch={handleOnSearch}
              />
            )}
            {!hideFilters && (
              <WorkOrderListParamsFormIconButton
                params={sanitizedParams}
                loading={workOrderListQuery.isLoading}
                onChange={handleOnFilterChange}
              />
            )}
          </Stack>
          <WorkOrderListParamsChipList
            params={sanitizedParams}
            onChange={handleOnFilterChange}
          />
        </Stack>
      )}
      <Stack spacing={1} {...slotProps?.list}>
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
            empty={
              workOrderListQuery.data?.count === 0 && "No work orders found"
            }
          />
        )}
        {pageCount > 1 && (
          <Pagination
            count={pageCount}
            {...(pageCount > 10 && {
              showFirstButton: true,
              showLastButton: true,
            })}
            disabled={workOrderListQuery.isLoading}
            page={page}
            onChange={(_event, page) => handlePageChange(page)}
            {...slotProps?.pagination}
            sx={[
              { alignSelf: "center" },
              ...sxUtils.asArray(slotProps?.pagination?.sx),
            ]}
          />
        )}
      </Stack>
    </Stack>
  );
};

export default WorkOrderList;
