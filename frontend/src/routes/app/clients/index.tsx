import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Chip, Stack } from "@mui/material";
import { FilterAlt, Sort } from "@mui/icons-material";
import { clientQueries } from "@/store/queries/clients";
import { paramUtils } from "@/store/utils/params";
import PaginatedList from "@/components/lists/PaginatedList";
import ClientListCard from "@/containers/cards/ClientListCard";
import ClientApiListRequestFormIconButton from "@/containers/buttons/ClientApiListRequestFormIconButton";
import DebouncedSearchField from "@/components/fields/DebouncedSearchField";
import { PAGE_HEADER_HEIGHT } from "@/store/constants/layout";
import type { ClientApiListRequest } from "@/store/types/clients";

const cleanParams = (params: Record<string, unknown>) => {
  const workOrdersStatus = params.work_orders__status;
  if (workOrdersStatus && !(workOrdersStatus instanceof Array))
    params.work_orders__status = [workOrdersStatus];

  return paramUtils.cleanApiListRequestParams<ClientApiListRequest>(params);
};

export const Route = createFileRoute("/app/clients/")({
  validateSearch: cleanParams,
  component: RouteComponent,
});

function RouteComponent() {
  /** Values */

  const params = Route.useSearch();
  const navigate = useNavigate();

  const queryOptions = clientQueries.list(params);

  /** Callbacks */

  const handleParamsChange = (newParams: ClientApiListRequest) =>
    navigate({ to: "/app/clients", search: cleanParams(newParams) });

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
            placeholder="Search clients..."
            onSearch={(search) =>
              handleParamsChange({ ...params, page: 1, search })
            }
          />
          <ClientApiListRequestFormIconButton
            form={{
              values: params,
              onSubmit: (data) => handleParamsChange(data),
            }}
          />
        </Stack>
        {(!!params.work_orders__status?.length || !!params.ordering) && (
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
            {params.work_orders__status?.map((status) => (
              <Chip
                key={status}
                label={`Work Orders: ${status.snakeCaseToTitleCase()}`}
                icon={<FilterAlt />}
                size="xs"
                onDelete={() =>
                  handleParamsChange({
                    ...params,
                    work_orders__status: params.work_orders__status?.filter(
                      (s) => s !== status
                    ),
                  })
                }
              />
            ))}
          </Stack>
        )}
      </Stack>
      <PaginatedList
        queryOptions={queryOptions}
        renderItem={(client) => (
          <ClientListCard key={client.id} client={client} />
        )}
        onPageChange={(page) => handleParamsChange({ ...params, page })}
        sx={{ p: 2 }}
      />
    </>
  );
}
