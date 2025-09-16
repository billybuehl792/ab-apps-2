import { useState } from "react";
import { Chip, Stack, type StackProps } from "@mui/material";
import { FilterAlt, Sort } from "@mui/icons-material";
import { workOrderQueries } from "@/store/queries/work-orders";
import DebouncedSearchField from "@/components/fields/DebouncedSearchField";
import PaginatedList from "@/components/lists/PaginatedList";
import WorkOrderApiListRequestFormIconButton from "@/containers/buttons/WorkOrderApiListRequestFormIconButton";
import WorkOrderListCard from "@/containers/cards/WorkOrderListCard";
import ClientChip from "@/containers/chips/ClientChip";
import { PAGE_HEADER_HEIGHT } from "@/store/constants/layout";
import type { WorkOrderApiListRequest } from "@/store/types/work-orders";

interface WorkOrderPaginatedListProps extends StackProps {
  queryOptions?: ReturnType<typeof workOrderQueries.list>;
  onParamsChange?: (newParams: Record<string, unknown>) => void;
  slotProps?: {
    header?: StackProps;
    list?: StackProps;
  };
}

const WorkOrderPaginatedList = ({
  queryOptions: queryOptionsProp,
  onParamsChange,
  slotProps,
  ...props
}: WorkOrderPaginatedListProps) => {
  const [localParams, setLocalParams] = useState<WorkOrderApiListRequest>({});

  /** Values */

  const queryOptions = queryOptionsProp ?? workOrderQueries.list(localParams);
  const params = queryOptions?.queryKey[1] ?? {};

  /** Callbacks */

  const handleParamsChange = (newParams: WorkOrderApiListRequest) => {
    if (onParamsChange) onParamsChange(newParams);
    else setLocalParams(newParams);
  };

  return (
    <Stack {...props}>
      <Stack
        spacing={1}
        p={2}
        pb={0}
        position="sticky"
        top={PAGE_HEADER_HEIGHT}
        bgcolor={(theme) => theme.palette.background.paper}
        zIndex={1}
        {...slotProps?.header}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <DebouncedSearchField
            value={params.search}
            size="small"
            placeholder="Search work orders..."
            onSearch={(search) =>
              handleParamsChange({ ...params, page: 1, search })
            }
          />
          <WorkOrderApiListRequestFormIconButton
            form={{ values: params, onSubmit: handleParamsChange }}
          />
        </Stack>
        {(!!params.status?.length ||
          params.client?.length ||
          !!params.ordering) && (
          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
            {!!params.ordering && (
              <Chip
                label={`Ordering: ${params.ordering.snakeCaseToTitleCase()}`}
                icon={<Sort />}
                size="xs"
                onDelete={() =>
                  handleParamsChange({ ...params, ordering: null })
                }
              />
            )}
            {params.client?.map((client) => (
              <ClientChip
                key={client}
                client={client}
                icon={<FilterAlt />}
                size="xs"
                onDelete={() =>
                  handleParamsChange({
                    ...params,
                    client: params.client?.filter((c) => c !== client),
                  })
                }
              />
            ))}
            {params.status?.map((status) => (
              <Chip
                key={status}
                label={`Work Orders: ${status.snakeCaseToTitleCase()}`}
                icon={<FilterAlt />}
                size="xs"
                onDelete={() =>
                  handleParamsChange({
                    ...params,
                    status: params.status?.filter((s) => s !== status),
                  })
                }
              />
            ))}
          </Stack>
        )}
      </Stack>
      <PaginatedList
        queryOptions={queryOptions}
        renderItem={(workOrder) => (
          <WorkOrderListCard key={workOrder.id} workOrder={workOrder} />
        )}
        onPageChange={(page) => handleParamsChange({ ...params, page })}
        sx={{ p: 2 }}
        {...slotProps?.list}
      />
    </Stack>
  );
};

export default WorkOrderPaginatedList;
