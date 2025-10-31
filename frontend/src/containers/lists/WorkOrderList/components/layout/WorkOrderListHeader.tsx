import { type ComponentProps } from "react";
import { useQuery } from "@tanstack/react-query";
import { Stack, type StackProps } from "@mui/material";
import { workOrderQueries } from "@/store/queries/work-orders";
import DebouncedSearchField from "@/components/fields/DebouncedSearchField";
import WorkOrderListFiltersIconButton from "../buttons/WorkOrderListFiltersIconButton";
import WorkOrderListParamsChipList from "./WorkOrderListParamsChipList";
import { DEFAULT_SEARCH } from "@/store/constants/api";
import type { WorkOrderListRequestParams } from "@/store/types/work-orders";

type WorkOrderListFilters = Pick<
  WorkOrderListRequestParams,
  "ordering" | "status" | "city" | "client"
>;

interface WorkOrderListHeaderProps extends StackProps {
  params: WorkOrderListRequestParams;
  baseParams?: Partial<WorkOrderListRequestParams>;
  onSearch: (term: string) => void;
  onFiltersChange: (params: WorkOrderListFilters) => void;
  slotProps?: {
    searchField?: Partial<ComponentProps<typeof DebouncedSearchField>>;
  };
}

const WorkOrderListHeader = ({
  params,
  baseParams,
  onSearch,
  onFiltersChange,
  slotProps,
  ...props
}: WorkOrderListHeaderProps) => {
  /** Values */

  const filteredParams = baseParams
    ? (Object.fromEntries(
        Object.entries(params).filter(([key]) => !(key in baseParams))
      ) as WorkOrderListRequestParams)
    : params;

  const search = params.search ?? DEFAULT_SEARCH;

  /** Queries */

  const workOrderListQuery = useQuery(
    workOrderQueries.list({ ...params, ...baseParams })
  );

  return (
    <Stack spacing={1} {...props}>
      <Stack direction="row" spacing={1} alignItems="center">
        <DebouncedSearchField
          value={search}
          loading={!!search && workOrderListQuery.isLoading}
          size="small"
          placeholder="Search Work Orders..."
          onSearch={onSearch}
          {...slotProps?.searchField}
        />
        <WorkOrderListFiltersIconButton
          params={params}
          baseParams={baseParams}
          onFiltersChange={onFiltersChange}
        />
      </Stack>
      <WorkOrderListParamsChipList
        params={filteredParams}
        onChange={onFiltersChange}
      />
    </Stack>
  );
};

export default WorkOrderListHeader;
