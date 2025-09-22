import { type JSX, useEffect, useState, type ComponentProps } from "react";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import {
  Pagination,
  type PaginationProps,
  Skeleton,
  Stack,
  type StackProps,
} from "@mui/material";
import StatusCard from "@/components/cards/StatusCard";
import { sxUtils } from "@/store/utils/sx";
import type { PaginatedQueryListBaseProps } from "../..";
import type { ApiListRequest, ApiListResponse } from "@/store/types/api";

interface PaginatedQueryListListProps<
  Params extends ApiListRequest,
  Data = unknown,
> extends PaginatedQueryListBaseProps<Params, Data>,
    Omit<StackProps, "children"> {
  renderItem: (item: Data) => JSX.Element;
  renderSkeletonItem?: (index: number) => JSX.Element;
  slotProps?: {
    statusCard?:
      | ComponentProps<typeof StatusCard>
      | ((
          query: UseQueryResult<ApiListResponse<Data>, Error>
        ) => ComponentProps<typeof StatusCard>);
    pagination?: Omit<
      PaginationProps,
      "count" | "page" | "onChange" | "disabled"
    >;
  };
}

const DEFAULT_PAGE_SIZE = 20;

const PaginatedQueryListList = <Params extends ApiListRequest, Data = unknown>({
  queryOptions,
  baseParams,
  onParamsChange,
  renderItem,
  renderSkeletonItem,
  slotProps,
  ...props
}: PaginatedQueryListListProps<Params, Data>) => {
  const [pageCount, setPageCount] = useState(0);

  /** Values */

  const params = queryOptions.queryKey[1] as Params;
  const { page = 1, page_size: pageSize = DEFAULT_PAGE_SIZE } = params;

  /** Queries */

  const query = useQuery(queryOptions);

  /** Callbacks */

  const handleParamsChange = (newParams: Params) =>
    onParamsChange({ ...newParams, ...baseParams });

  /** Effects */

  useEffect(() => {
    if (query.data) setPageCount(Math.ceil(query.data.count / pageSize));
  }, [query.data, pageSize]);

  useEffect(() => {
    if (query.isError && page > 1)
      onParamsChange({ ...params, ...baseParams, page: page - 1 });
  }, [query.isError, onParamsChange, params, baseParams, page]);

  return (
    <Stack spacing={1} {...props}>
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
          empty={query.data?.count === 0}
          {...(typeof slotProps?.statusCard === "function"
            ? slotProps.statusCard(query)
            : slotProps?.statusCard)}
        />
      )}
      {pageCount > 1 && (
        <Pagination
          count={pageCount}
          {...(pageCount > 10 && {
            showFirstButton: true,
            showLastButton: true,
          })}
          disabled={query.isLoading}
          page={page}
          onChange={(_event, page) => handleParamsChange({ ...params, page })}
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

export default PaginatedQueryListList;
