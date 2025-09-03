import { type JSX, useState, useEffect } from "react";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import {
  Pagination,
  type PaginationProps,
  Skeleton,
  Stack,
  type StackProps,
} from "@mui/material";
import DebouncedSearchField from "@/components/fields/DebouncedSearchField";
import FilterAndSortIconButton from "@/components/buttons/OrderingAndFiltersIconButton";
import StatusCard from "@/components/cards/StatusCard";
import { sxUtils } from "@/store/utils/sx";
import type {
  OrderingAndFiltersFormValues,
  FilterOption,
  OrderingOption,
} from "@/components/forms/OrderingAndFiltersForm";
import type { QueryKey } from "@/store/types/queries";
import type { ApiListRequest, ApiListResponse } from "@/store/types/api";

interface PaginatedListProps<
  P extends ApiListRequest | undefined = undefined,
  D = unknown,
  O extends OrderingOption = OrderingOption,
  F extends FilterOption = FilterOption,
> extends StackProps {
  queryOptions: UseQueryOptions<
    ApiListResponse<D>,
    Error,
    ApiListResponse<D>,
    QueryKey<P>
  >;
  orderingAndFiltersOptions?: {
    ordering: ReadonlyArray<O>;
    filters: ReadonlyArray<F>;
  };
  renderItem: (item: D) => JSX.Element;
  renderSkeletonItem?: (index: number) => JSX.Element;
  onPageChange?: (page: number) => void;
  onSearch?: (term: string) => void;
  onOrderingAndFiltersChange?: (
    data: OrderingAndFiltersFormValues<O, F>
  ) => void;
  slotProps?: {
    header?: StackProps;
    list?: StackProps;
    pagination?: PaginationProps;
  };
}

const DEFAULT_PAGE_SIZE = 20;

const PaginatedList = <
  P extends ApiListRequest | undefined = undefined,
  D = unknown,
  O extends OrderingOption = OrderingOption,
  F extends FilterOption = FilterOption,
>({
  queryOptions,
  orderingAndFiltersOptions,
  renderItem,
  renderSkeletonItem,
  onPageChange,
  onSearch,
  onOrderingAndFiltersChange,
  slotProps,
  ...props
}: PaginatedListProps<P, D, O, F>) => {
  const [pageCount, setPageCount] = useState(0);

  /** Values */

  const {
    search,
    ordering,
    page_size: pageSize = DEFAULT_PAGE_SIZE,
    page = 1,
    ...filters
  } = queryOptions.queryKey[1] ?? {};

  /** Queries */

  const query = useQuery(queryOptions);

  /** Effects */

  useEffect(() => {
    if (query.data) setPageCount(Math.ceil(query.data.count / pageSize));
  }, [query.data, pageSize]);

  return (
    <Stack spacing={2} {...props}>
      {(!!onSearch || !!orderingAndFiltersOptions) && (
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          {...slotProps?.header}
        >
          {!!onSearch && (
            <DebouncedSearchField
              value={search}
              size="small"
              placeholder="Search..."
              loading={!!search && query.isLoading}
              onSearch={onSearch}
            />
          )}
          {!!orderingAndFiltersOptions && !!onOrderingAndFiltersChange && (
            <FilterAndSortIconButton
              form={{
                orderingOptions: orderingAndFiltersOptions.ordering,
                filterOptions: orderingAndFiltersOptions.filters,
                values: {
                  ordering: orderingAndFiltersOptions.ordering.find(
                    (option) => option.value === ordering
                  ),
                  filters: orderingAndFiltersOptions.filters.filter((option) =>
                    Object.entries(filters).some(
                      ([key, value]) =>
                        option.id === key && option.value === value
                    )
                  ),
                },
                onSubmit: async (data) => onOrderingAndFiltersChange(data),
              }}
            />
          )}
        </Stack>
      )}
      <Stack spacing={1} {...slotProps?.list}>
        {query.isLoading ? (
          Array.from({ length: pageSize }).map(
            (_, index) =>
              renderSkeletonItem?.(index) ?? (
                <Skeleton key={index} variant="rounded" height={84} />
              )
          )
        ) : query.isSuccess && query.data.count ? (
          query.data.results.map(renderItem)
        ) : (
          <StatusCard
            error={query.error}
            {...(query.data?.count === 0 && {
              empty: "No Results",
              label: search
                ? `Searching "${search}"`
                : Object.keys(filters).length
                  ? `Filtering by '${Object.keys(filters).join(", ")}'`
                  : undefined,
            })}
          />
        )}
      </Stack>
      {pageCount > 1 && !!onPageChange && (
        <Pagination
          count={pageCount}
          {...(pageCount > 10 && {
            showFirstButton: true,
            showLastButton: true,
          })}
          disabled={query.isLoading}
          page={page}
          onChange={(_event, value) => onPageChange(value)}
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
