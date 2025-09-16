import { useState } from "react";
import { Stack, type StackProps } from "@mui/material";
import { clientQueries } from "@/store/queries/clients";
import DebouncedSearchField from "@/components/fields/DebouncedSearchField";
import PaginatedList from "@/components/lists/PaginatedList";
import ClientListCard from "@/containers/cards/ClientListCard";
import ClientPaginatedListFilters from "./ClientPaginatedListFilters";
import ClientApiListRequestFormIconButton from "@/containers/buttons/ClientApiListRequestFormIconButton";
import { PAGE_HEADER_HEIGHT } from "@/store/constants/layout";
import type { ClientApiListRequest } from "@/store/types/clients";

interface ClientPaginatedListProps extends StackProps {
  queryOptions?: ReturnType<typeof clientQueries.list>;
  onParamsChange?: (params: ClientApiListRequest) => void;
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

  const showFilters = Boolean(
    params.ordering ||
      params.work_orders__status?.length ||
      params.place__city?.length
  );

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
        {showFilters && (
          <ClientPaginatedListFilters
            queryOptions={queryOptions}
            onParamsChange={handleParamsChange}
          />
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
