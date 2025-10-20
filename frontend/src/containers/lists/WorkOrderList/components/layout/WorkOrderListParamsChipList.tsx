import { useQueries } from "@tanstack/react-query";
import { Chip, Stack, type StackProps } from "@mui/material";
import { Close, FilterAlt, Sort } from "@mui/icons-material";
import { clientQueries } from "@/store/queries/clients";
import type { WorkOrderListRequestParams } from "@/store/types/work-orders";

interface WorkOrderListParamsChipListProps
  extends Omit<StackProps, "onChange"> {
  params: WorkOrderListRequestParams;
  baseParams?: Pick<WorkOrderListRequestParams, "client" | "status" | "city">;
  onChange?: (params: WorkOrderListRequestParams) => void;
}

const WorkOrderListParamsChipList = ({
  params,
  onChange,
  ...props
}: WorkOrderListParamsChipListProps) => {
  /** Values */

  const ordering = params.ordering;
  const statuses = params.status ?? [];
  const cities = params.city ?? [];
  const clientIds = params.client ?? [];

  const hasParams =
    !!ordering ||
    statuses.length > 0 ||
    cities.length > 0 ||
    clientIds.length > 0;

  /** Queries */

  const clientsQueries = useQueries({
    queries:
      params.client?.map((clientId) => clientQueries.detail(clientId)) ?? [],
  });

  /** Callbacks */

  const handleClearAll = () =>
    onChange?.({
      ...params,
      page: undefined,
      ordering: undefined,
      status: [],
      city: [],
      client: [],
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
      {!!ordering && (
        <Chip
          label={`Ordering: ${ordering.snakeCaseToTitleCase()}`}
          icon={<Sort />}
          size="xs"
          {...(onChange && {
            onDelete: () => onChange({ ...params, ordering: undefined }),
          })}
        />
      )}
      {statuses.map((status) => (
        <Chip
          key={status}
          icon={<FilterAlt />}
          label={`Status: ${status.snakeCaseToTitleCase()}`}
          size="xs"
          {...(onChange && {
            onDelete: () =>
              onChange({
                ...params,
                status: statuses.filter((s) => s !== status),
              }),
          })}
        />
      ))}
      {cities.map((city) => (
        <Chip
          key={city}
          icon={<FilterAlt />}
          label={`City: ${city.toTitleCase()}`}
          size="xs"
          {...(onChange && {
            onDelete: () =>
              onChange({
                ...params,
                city: cities.filter((c) => c !== city),
              }),
          })}
        />
      ))}
      {clientIds.map((clientId) => {
        const clientQuery = clientsQueries.find((q) => q.data?.id === clientId);
        return (
          <Chip
            key={clientId}
            icon={<FilterAlt />}
            label={`Client: ${clientQuery?.isLoading ? "..." : (clientQuery?.data?.full_name ?? clientId)}`}
            size="xs"
            {...(onChange && {
              onDelete: () =>
                onChange({
                  ...params,
                  client: clientIds.filter((id) => id !== clientId),
                }),
            })}
          />
        );
      })}
      <Chip
        label="Clear All"
        icon={<Close />}
        size="xs"
        variant="outlined"
        color="error"
        onClick={handleClearAll}
      />
    </Stack>
  );
};

export default WorkOrderListParamsChipList;
