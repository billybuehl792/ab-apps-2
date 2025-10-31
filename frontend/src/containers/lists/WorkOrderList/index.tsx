import { type ComponentProps } from "react";
import { Stack, type StackProps } from "@mui/material";
import WorkOrderListHeader from "./components/layout/WorkOrderListHeader";
import WorkOrderListPaginatedList from "./components/layout/WorkOrderListPaginatedList";
import { workOrderListParamsSchema } from "@/store/schemas/work-orders";
import type { WorkOrderListRequestParams } from "@/store/types/work-orders";

interface WorkOrderListProps extends StackProps {
  params: WorkOrderListRequestParams;
  baseParams?: Partial<WorkOrderListRequestParams>;
  onParamsChange: (params: WorkOrderListRequestParams) => void;
  slotProps?: {
    header?: Partial<
      Omit<
        ComponentProps<typeof WorkOrderListHeader>,
        "params" | "onSearch" | "onFiltersChange"
      >
    >;
    list?: Partial<
      Omit<
        ComponentProps<typeof WorkOrderListPaginatedList>,
        "params" | "onPageChange"
      >
    >;
  };
}

const WorkOrderList = ({
  params,
  baseParams,
  onParamsChange,
  slotProps,
  ...props
}: WorkOrderListProps) => {
  /** Callbacks */

  const handleOnParamsChange = (newParams: WorkOrderListRequestParams) =>
    onParamsChange(
      workOrderListParamsSchema.parse({ ...newParams, ...baseParams })
    );

  const handlePageChange = (page: number) =>
    handleOnParamsChange({ ...params, page });

  const handleOnSearch: ComponentProps<
    typeof WorkOrderListHeader
  >["onSearch"] = (term) =>
    handleOnParamsChange({ ...params, page: undefined, search: term });

  const handleOnFiltersChange: ComponentProps<
    typeof WorkOrderListHeader
  >["onFiltersChange"] = (newParams) =>
    handleOnParamsChange({ ...params, ...newParams, page: undefined });

  return (
    <Stack spacing={2} {...props}>
      <WorkOrderListHeader
        params={params}
        baseParams={baseParams}
        onSearch={handleOnSearch}
        onFiltersChange={handleOnFiltersChange}
        {...slotProps?.header}
      />
      <WorkOrderListPaginatedList
        params={{ ...params, ...baseParams }}
        onPageChange={handlePageChange}
        {...slotProps?.list}
      />
    </Stack>
  );
};

export default WorkOrderList;
