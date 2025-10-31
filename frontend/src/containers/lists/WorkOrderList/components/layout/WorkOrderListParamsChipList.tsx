import { useQuery } from "@tanstack/react-query";
import { Chip, type ChipProps, Stack, type StackProps } from "@mui/material";
import { Close, FilterAlt, Sort } from "@mui/icons-material";
import { clientQueries } from "@/store/queries/clients";
import { WorkOrderStatus } from "@/store/enums/work-orders";
import type { WorkOrderListRequestParams } from "@/store/types/work-orders";

type WorkOrderListFilters = Pick<
  WorkOrderListRequestParams,
  "ordering" | "status" | "city" | "client"
>;

interface WorkOrderListParamsChipListProps
  extends Omit<StackProps, "onChange"> {
  params: WorkOrderListFilters;
  onChange: (values: WorkOrderListFilters) => void;
}

const WorkOrderListParamsChipList = ({
  params,
  onChange,
  ...props
}: WorkOrderListParamsChipListProps) => {
  /** Values */

  const hasParams =
    !!params.ordering ||
    !!params.status?.length ||
    !!params.city?.length ||
    !!params.client?.length;

  /** Callbacks */

  const handleRemoveOrdering = () => onChange({ ordering: undefined });

  const handleRemoveStatus = (status: WorkOrderStatus) =>
    onChange({ status: params?.status?.filter((s) => s !== status) });

  const handleRemoveCity = (city: string) =>
    onChange({ city: params?.city?.filter((c) => c !== city) });

  const handleRemoveClient = (clientId: number) =>
    onChange({ client: params?.client?.filter((id) => id !== clientId) });

  const handleClearAll = () =>
    onChange({
      ordering: undefined,
      status: undefined,
      city: undefined,
      client: undefined,
    });

  if (!hasParams) return null;
  return (
    <Stack
      direction="row"
      spacing={0.5}
      alignItems="center"
      useFlexGap
      flexWrap="wrap"
      {...props}
    >
      {!!params.ordering && (
        <Chip
          label={`Ordering: ${params.ordering.snakeCaseToTitleCase()}`}
          icon={<Sort />}
          size="xs"
          onDelete={handleRemoveOrdering}
        />
      )}
      {params.status?.map((status) => (
        <Chip
          key={status}
          icon={<FilterAlt />}
          label={`Status: ${status.snakeCaseToTitleCase()}`}
          size="xs"
          onDelete={() => handleRemoveStatus(status)}
        />
      ))}
      {params.city?.map((city) => (
        <Chip
          key={city}
          icon={<FilterAlt />}
          label={`City: ${city.toTitleCase()}`}
          size="xs"
          onDelete={() => handleRemoveCity(city)}
        />
      ))}
      {params.client?.map((clientId) => (
        <ClientFilterChip
          key={clientId}
          clientId={clientId}
          onDelete={() => handleRemoveClient(clientId)}
        />
      ))}
      <Chip
        label="Clear All"
        icon={<Close />}
        size="xs"
        variant="outlined"
        color="error"
        onClick={handleClearAll}
        sx={{ border: "none", "&:active": { boxShadow: "none" } }}
      />
    </Stack>
  );
};

const ClientFilterChip = ({
  clientId,
  ...props
}: ChipProps & { clientId: number }) => {
  /** Queries */

  const clientQuery = useQuery(clientQueries.detail(clientId));

  return (
    <Chip
      icon={<FilterAlt />}
      label={`Client: ${clientQuery?.isLoading ? "..." : (clientQuery?.data?.full_name ?? clientId)}`}
      size="xs"
      {...props}
    />
  );
};

export default WorkOrderListParamsChipList;
