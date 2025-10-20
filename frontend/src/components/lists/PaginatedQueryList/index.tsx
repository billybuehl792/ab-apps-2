import { type ComponentProps } from "react";
import { type UseQueryOptions } from "@tanstack/react-query";
import { Stack, type StackProps } from "@mui/material";
import PaginatedQueryListHeader from "./components/layout/PaginatedQueryListHeader";
import PaginatedQueryListList from "./components/lists/PaginatedQueryListList";
import type { QueryKey } from "@/store/types/queries";
import type { ListRequestParams, ListResponse } from "@/store/types/api";

export interface PaginatedQueryListBaseProps<
  Params extends ListRequestParams,
  Data = unknown,
> {
  queryOptions: UseQueryOptions<
    ListResponse<Data>,
    Error,
    ListResponse<Data>,
    QueryKey<Params>
  >;
  /** If provided, these will be merged into the current query params and cannot be changed by the user. */
  baseParams?: Partial<Omit<Params, "page" | "page_size">>;
  onParamsChange: (params: Params) => void;
}

interface PaginatedQueryListProps<
  Params extends ListRequestParams,
  Data = unknown,
> extends Omit<StackProps, "children">,
    PaginatedQueryListBaseProps<Params, Data>,
    Pick<
      ComponentProps<typeof PaginatedQueryListList<Params, Data>>,
      "renderItem" | "renderSkeletonItem"
    >,
    Pick<
      ComponentProps<typeof PaginatedQueryListHeader<Params, Data>>,
      "renderParamsChips" | "ParamsFormComponent"
    > {
  slotProps?: {
    header?: Partial<
      Omit<
        ComponentProps<typeof PaginatedQueryListHeader<Params, Data>>,
        "queryOptions" | "baseParams" | "onParamsChange"
      >
    >;
    list?: Partial<
      Omit<
        ComponentProps<typeof PaginatedQueryListList<Params, Data>>,
        "children" | "queryOptions" | "baseParams" | "onParamsChange"
      >
    >;
  };
}

const PaginatedQueryList = <Params extends ListRequestParams, Data = unknown>({
  queryOptions,
  baseParams,
  ParamsFormComponent,
  onParamsChange,
  renderItem,
  renderSkeletonItem,
  renderParamsChips,
  slotProps,
  ...props
}: PaginatedQueryListProps<Params, Data>) => {
  /** Values */

  const params = queryOptions.queryKey[1] as Params;

  /** Callbacks */

  const handleParamsChange = (newParams: Params) =>
    onParamsChange({ ...newParams, ...baseParams });

  const handlePageChange = (page: number) =>
    handleParamsChange({ ...params, page });

  return (
    <Stack spacing={2} {...props}>
      <PaginatedQueryListHeader
        queryOptions={queryOptions}
        baseParams={baseParams}
        ParamsFormComponent={ParamsFormComponent}
        onParamsChange={handleParamsChange}
        {...slotProps?.header}
      />
      <PaginatedQueryListList
        queryOptions={queryOptions}
        renderItem={renderItem}
        renderSkeletonItem={renderSkeletonItem}
        onPageChange={handlePageChange}
        {...slotProps?.list}
      />
    </Stack>
  );
};

export default PaginatedQueryList;
