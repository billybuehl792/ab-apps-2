import { useState } from "react";
import { Chip, Stack, type StackProps } from "@mui/material";
import { FilterAlt, Sort } from "@mui/icons-material";
import { clientQueries } from "@/store/queries/clients";
import DebouncedSearchField from "@/components/fields/DebouncedSearchField";
import PaginatedList from "@/components/lists/PaginatedList";
import ClientListCard from "@/containers/cards/ClientListCard";
import ClientApiListRequestFormIconButton from "@/containers/buttons/ClientApiListRequestFormIconButton";
import { PAGE_HEADER_HEIGHT } from "@/store/constants/layout";
import type { ClientApiListRequest } from "@/store/types/clients";

interface ClientPaginatedListProps extends StackProps {
  queryOptions?: ReturnType<typeof clientQueries.list>;
  onParamsChange?: (newParams: Record<string, unknown>) => void;
  slotProps?: {
    header?: StackProps;
    list?: StackProps;
  };
}

const ClientPaginatedList = ({
  queryOptions: queryOptionsProp,
  onParamsChange,
  slotProps,
  ...props
}: ClientPaginatedListProps) => {
  const [localParams, setLocalParams] = useState<ClientApiListRequest>({});

  /** Values */

  const queryOptions = queryOptionsProp ?? clientQueries.list(localParams);
  const params = queryOptions?.queryKey[1] ?? {};

  /** Callbacks */

  const handleParamsChange = (newParams: ClientApiListRequest) => {
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
        {...slotProps?.list}
      />
    </Stack>
  );
};

export default ClientPaginatedList;
