import { type ReactNode } from "react";
import {
  Skeleton,
  type SkeletonProps,
  Stack,
  type StackProps,
  TablePagination,
  type TablePaginationProps,
} from "@mui/material";
import StatusWrapper, {
  type IStatusWrapperProps,
} from "@/components/layout/StatusWrapper";

type TDefaultItem = { id: number | string };

export interface IPaginatedListProps<
  TItem extends TDefaultItem,
> extends StackProps {
  items: TItem[];
  page: number;
  pageSize: number;
  /** Total items. `false` if unknown */
  total: number | false;
  disabled?: boolean;
  loading?: IStatusWrapperProps["loading"];
  error?: IStatusWrapperProps["error"];
  empty?: IStatusWrapperProps["empty"];
  renderItem: (item: TItem, index: number) => ReactNode;
  renderSkeletonItem?: true | ((index: number) => ReactNode);
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  slotProps?: {
    skeletonItem?: Partial<SkeletonProps>;
    statusWrapper?: Partial<IStatusWrapperProps>;
    pagination?: Partial<TablePaginationProps>;
  };
}

const PaginatedList = <TItem extends TDefaultItem>({
  items,
  page,
  pageSize,
  total,
  disabled,
  loading,
  error,
  empty: emptyProp,
  renderItem,
  renderSkeletonItem,
  onPageChange,
  onPageSizeChange,
  slotProps,
  ...props
}: IPaginatedListProps<TItem>) => {
  /** Values */

  const pageCount = typeof total === "number" ? Math.ceil(total / pageSize) : 0;
  const empty =
    emptyProp || (!loading && !error && (total === 0 || items.length === 0));

  /** Callbacks */

  const handleOnPageChange: TablePaginationProps["onPageChange"] = (
    _event,
    page,
  ) => onPageChange(Math.min(Math.max(1, page + 1), pageCount));

  const handleOnPageSizeChange: TablePaginationProps["onRowsPerPageChange"] = (
    event,
  ) => onPageSizeChange?.(parseInt(event.target.value, 10));

  return (
    <Stack position="relative" spacing={1} {...props}>
      {loading || error || empty ? (
        !!loading && !!renderSkeletonItem ? (
          Array(pageSize)
            .fill(null)
            .map((_, index) =>
              typeof renderSkeletonItem === "function" ? (
                renderSkeletonItem(index)
              ) : (
                <Skeleton
                  key={index}
                  variant="rounded"
                  height={100}
                  {...slotProps?.skeletonItem}
                />
              ),
            )
        ) : (
          <StatusWrapper
            loading={loading}
            error={error}
            empty={empty}
            {...slotProps?.statusWrapper}
          />
        )
      ) : (
        items.map((item, index) => renderItem(item, index))
      )}
      <TablePagination
        component="div"
        labelRowsPerPage="Items per page"
        count={total === false ? -1 : total}
        disabled={disabled || !!loading}
        page={Math.max(0, page - 1)}
        showFirstButton
        showLastButton
        rowsPerPageOptions={[10, 20, 50, 100]}
        rowsPerPage={pageSize}
        onPageChange={handleOnPageChange}
        onRowsPerPageChange={handleOnPageSizeChange}
        {...slotProps?.pagination}
      />
    </Stack>
  );
};

export default PaginatedList;
