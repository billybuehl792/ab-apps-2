import { type ComponentProps, type ReactNode } from "react";
import {
  Pagination,
  type PaginationProps,
  Skeleton,
  type SkeletonProps,
  Stack,
  type StackProps,
} from "@mui/material";
import PaginatedListHeader from "./components/PaginatedListHeader";
import StatusWrapper, {
  type IStatusWrapperProps,
} from "@/components/layout/StatusWrapper";
import { sxUtils } from "@/store/utils/sx";
import type { TListRequest } from "@/store/types/api";

type TDefaultItem = { id: number | string };

export interface IPaginatedListProps<
  TItem extends TDefaultItem,
  TParams extends TListRequest["params"] = TListRequest["params"],
> extends StackProps {
  items: TItem[];
  params: TParams;
  /** Total items. `false` if unknown */
  total: number | false;
  disabled?: boolean;
  loading?: IStatusWrapperProps["loading"];
  error?: IStatusWrapperProps["error"];
  empty?: IStatusWrapperProps["empty"];
  renderItem: (item: TItem, index: number) => ReactNode;
  renderSkeletonItem?: true | ((index: number) => ReactNode);
  onPageChange: PaginationProps["onChange"];
  onSearchChange?: ComponentProps<typeof PaginatedListHeader>["onSearchChange"];
  slotProps?: {
    header?: Partial<ComponentProps<typeof PaginatedListHeader>>;
    skeletonItem?: Partial<SkeletonProps>;
    statusWrapper?: Partial<IStatusWrapperProps>;
    pagination?: Partial<Omit<PaginationProps, "page" | "count" | "onChange">>;
  };
}

const PaginatedList = <
  TItem extends TDefaultItem,
  TParams extends TListRequest["params"] = TListRequest["params"],
>({
  items,
  params,
  total,
  disabled,
  loading,
  error,
  empty: emptyProp,
  renderItem,
  renderSkeletonItem,
  onPageChange,
  onSearchChange,
  slotProps,
  ...props
}: IPaginatedListProps<TItem, TParams>) => {
  /** Values */

  const page = params.page;
  const pageSize = params.page_size;
  const pageCount = typeof total === "number" ? Math.ceil(total / pageSize) : 0;

  const empty =
    emptyProp || (!loading && !error && (total === 0 || items.length === 0));

  return (
    <Stack position="relative" spacing={1} {...props}>
      {!!onSearchChange && (
        <PaginatedListHeader
          params={params}
          loading={!!loading}
          onSearchChange={onSearchChange}
          {...slotProps?.header}
        />
      )}
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
      {pageCount > 1 && (
        <Pagination
          count={pageCount}
          disabled={disabled}
          page={page}
          showFirstButton={pageCount > 10}
          showLastButton={pageCount > 10}
          onChange={onPageChange}
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

export default PaginatedList;
