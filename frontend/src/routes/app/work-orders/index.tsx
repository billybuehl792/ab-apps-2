import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Chip, Stack } from "@mui/material";
import { workOrderQueries } from "@/store/queries/work-orders";
import { paramUtils } from "@/store/utils/params";
import PaginatedList from "@/components/lists/PaginatedList";
import WorkOrderListCard from "@/containers/cards/WorkOrderListCard";
import WorkOrderApiListRequestFormIconButton from "@/containers/buttons/WorkOrderApiListRequestFormIconButton";
import DebouncedSearchField from "@/components/fields/DebouncedSearchField";
import { PAGE_HEADER_HEIGHT } from "@/store/constants/layout";
import type { WorkOrderApiListRequest } from "@/store/types/work-orders";
import { FilterAlt, Sort } from "@mui/icons-material";
import ClientChip from "@/containers/chips/ClientChip";

const cleanParams = (params: Record<string, unknown>) => {
  const status = params.status;
  const client = params.client;
  if (status && !(status instanceof Array)) params.status = [status];
  if (client && !(client instanceof Array)) params.client = [client];

  return paramUtils.cleanApiListRequestParams<WorkOrderApiListRequest>(params);
};

export const Route = createFileRoute("/app/work-orders/")({
  validateSearch: cleanParams,
  component: RouteComponent,
});

function RouteComponent() {
  /** Values */

  const params = Route.useSearch();
  const navigate = useNavigate();

  const queryOptions = workOrderQueries.list(params);

  /** Callbacks */

  const handleParamsChange = (newParams: WorkOrderApiListRequest) =>
    navigate({ to: "/app/work-orders", search: cleanParams(newParams) });

  return (
    <>
      <Stack
        spacing={1}
        p={2}
        pb={0}
        position="sticky"
        top={PAGE_HEADER_HEIGHT}
        bgcolor={(theme) => theme.palette.background.paper}
        zIndex={1}
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
      />
    </>
  );
}
