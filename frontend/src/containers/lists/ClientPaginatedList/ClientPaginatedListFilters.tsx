import { Chip, Stack, type StackProps } from "@mui/material";
import { FilterAlt, Sort } from "@mui/icons-material";
import { clientQueries } from "@/store/queries/clients";
import type { ClientApiListRequest } from "@/store/types/clients";

interface ClientPaginatedListFiltersProps extends StackProps {
  queryOptions: ReturnType<typeof clientQueries.list>;
  onParamsChange: (params: ClientApiListRequest) => void;
}

const ClientPaginatedListFilters = ({
  queryOptions,
  onParamsChange,
  ...props
}: ClientPaginatedListFiltersProps) => {
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
      {params.work_orders__status?.map((status) => (
        <Chip
          key={status}
          label={`Work Order Status: ${status.snakeCaseToTitleCase()}`}
          icon={<FilterAlt />}
          size="xs"
          onDelete={() =>
            onParamsChange({
              ...params,
              work_orders__status: params.work_orders__status?.filter(
                (s) => s !== status
              ),
            })
          }
        />
      ))}
    </Stack>
  );
};

export default ClientPaginatedListFilters;
