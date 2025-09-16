import { Chip, Stack, type StackProps } from "@mui/material";
import { FilterAlt, Sort } from "@mui/icons-material";
import { workOrderQueries } from "@/store/queries/work-orders";
import ClientChip from "@/containers/chips/ClientChip";
import type { WorkOrderApiListRequest } from "@/store/types/work-orders";

interface WorkOrderPaginatedListFiltersProps extends StackProps {
  queryOptions: ReturnType<typeof workOrderQueries.list>;
  onParamsChange: (params: WorkOrderApiListRequest) => void;
}

const WorkOrderPaginatedListFilters = ({
  queryOptions,
  onParamsChange,
  ...props
}: WorkOrderPaginatedListFiltersProps) => {
  /** Values */

  const params = queryOptions.queryKey[1];

  return (
    <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" {...props}>
      {!!params.ordering && (
        <Chip
          label={`Ordering: ${params.ordering.snakeCaseToTitleCase()}`}
          icon={<Sort />}
          size="xs"
          onDelete={() => onParamsChange({ ...params, ordering: null })}
        />
      )}
      {params.client?.map((client) => (
        <ClientChip
          key={client}
          client={client}
          icon={<FilterAlt />}
          size="xs"
          onDelete={() =>
            onParamsChange({
              ...params,
              client: params.client?.filter((c) => c !== client),
            })
          }
        />
      ))}
      {params.status?.map((status) => (
        <Chip
          key={status}
          label={status.snakeCaseToTitleCase()}
          icon={<FilterAlt />}
          size="xs"
          onDelete={() =>
            onParamsChange({
              ...params,
              status: params.status?.filter((s) => s !== status),
            })
          }
        />
      ))}
      {params.place__city?.map((city) => (
        <Chip
          key={city}
          label={`City: ${city}`}
          icon={<FilterAlt />}
          size="xs"
          onDelete={() =>
            onParamsChange({
              ...params,
              place__city: params.place__city?.filter((c) => c !== city),
            })
          }
        />
      ))}
    </Stack>
  );
};

export default WorkOrderPaginatedListFilters;
