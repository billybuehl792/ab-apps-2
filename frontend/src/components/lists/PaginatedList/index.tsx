import { type JSX, useState, useEffect } from "react";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import {
  Pagination,
  type PaginationProps,
  Skeleton,
  Stack,
  type StackProps,
} from "@mui/material";
import StatusCard from "@/components/cards/StatusCard";
import { sxUtils } from "@/store/utils/sx";
import type { QueryKey } from "@/store/types/queries";
import type { ApiListRequest, ApiListResponse } from "@/store/types/api";

interface PaginatedListProps<
  TParams extends ApiListRequest = ApiListRequest,
  TData = unknown,
> extends StackProps {
  queryOptions: UseQueryOptions<
    ApiListResponse<TData>,
    Error,
    ApiListResponse<TData>,
    QueryKey<TParams>
  >;
  renderItem: (item: TData) => JSX.Element;
  renderSkeletonItem?: (index: number) => JSX.Element;
  onPageChange?: (page: number) => void;
  onSearch?: (term: string) => void;
  slotProps?: {
    list?: StackProps;
    pagination?: PaginationProps;
  };
}

const DEFAULT_PAGE_SIZE = 20;

const PaginatedList = <
  TParams extends ApiListRequest = ApiListRequest,
  TData = unknown,
>({
  queryOptions,
  slotProps,
  renderItem,
  renderSkeletonItem,
  onPageChange,
  ...props
}: PaginatedListProps<TParams, TData>) => {
  const [pageCount, setPageCount] = useState(0);

  /** Values */

  const { page_size: pageSize = DEFAULT_PAGE_SIZE, page = 1 } =
    queryOptions.queryKey[1] ?? {};

  /** Queries */

  const query = useQuery(queryOptions);

  /** Effects */

  useEffect(() => {
    if (query.data) setPageCount(Math.ceil(query.data.count / pageSize));
  }, [query.data, pageSize]);

  return (
    <Stack spacing={2} {...props}>
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
          <StatusCard error={query.error} empty={query.data?.count === 0} />
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
