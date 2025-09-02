import { type ComponentProps, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Pagination,
  type PaginationProps,
  Skeleton,
  Stack,
  type StackProps,
} from "@mui/material";
import { clientQueries } from "@/store/queries/clients";
import Link from "@/components/elements/Link";
import StatusCard from "@/components/cards/StatusCard";
import ClientListCard from "@/containers/cards/ClientListCard";
import DebouncedSearchField from "@/components/fields/DebouncedSearchField";
import FilterAndSortIconButton from "@/components/buttons/FilterAndSortIconButton";
import { ClientListFilters, ClientListOrdering } from "@/store/enums/clients";
import { sxUtils } from "@/store/utils/sx";

interface ClientListProps extends StackProps {
  params?: Parameters<typeof clientQueries.list>[0];
  onPageChange: (page: number) => void;
  onSearch?: (term: string) => void;
  onFilterAndSort?: ComponentProps<
    typeof FilterAndSortIconButton<ClientListOrdering, ClientListFilters>
  >["form"]["onSubmit"];
  slotProps?: {
    header?: StackProps;
    list?: StackProps;
    pagination?: PaginationProps;
  };
}

const DEFAULT_PAGE_SIZE = 20;
const FILTER_OPTIONS = Object.values(ClientListFilters).map((filter) => ({
  value: filter,
  label: filter.replace("_", " ").toTitleCase(),
}));
const ORDERING_OPTIONS = Object.values(ClientListOrdering).map((ordering) => ({
  value: ordering,
  label: ordering.replace("_", " ").toTitleCase(),
}));

const ClientList = ({
  params,
  onPageChange,
  onSearch,
  onFilterAndSort,
  slotProps,
  ...props
}: ClientListProps) => {
  const [pageCount, setPageCount] = useState(0);

  /** Values */

  const {
    search,
    ordering,
    page_size: pageSize = DEFAULT_PAGE_SIZE,
    page = 1,
    ...filters
  } = params ?? {};

  /** Queries */

  const clientListQuery = useQuery(clientQueries.list(params));

  /** Effects */

  useEffect(() => {
    if (clientListQuery.data)
      setPageCount(Math.ceil(clientListQuery.data.count / pageSize));
  }, [clientListQuery.data, pageSize]);

  return (
    <Stack spacing={2} {...props}>
      {(!!onSearch || !!onFilterAndSort) && (
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          {...slotProps?.header}
        >
          {!!onSearch && (
            <DebouncedSearchField
              value={search}
              size="small"
              placeholder="Search clients..."
              onSearch={onSearch}
            />
          )}
          {!!onFilterAndSort && (
            <FilterAndSortIconButton
              form={{
                filterOptions: FILTER_OPTIONS,
                orderingOptions: ORDERING_OPTIONS,
                values: {
                  ordering: ORDERING_OPTIONS.find((o) => o.value === ordering),
                  filters: FILTER_OPTIONS.filter((o) =>
                    Object.keys(filters).includes(o.value)
                  ),
                },
                onSubmit: onFilterAndSort,
              }}
            />
          )}
        </Stack>
      )}
      <Stack spacing={1} {...slotProps?.list}>
        {clientListQuery.isLoading ? (
          Array.from({ length: pageSize }).map((_, index) => (
            <Skeleton key={index} variant="rounded" height={84} />
          ))
        ) : clientListQuery.isSuccess && clientListQuery.data.count ? (
          clientListQuery.data.results.map((client) => (
            <ClientListCard key={client.id} client={client} />
          ))
        ) : (
          <StatusCard
            error={clientListQuery.error}
            {...(clientListQuery.data?.count === 0 && {
              empty: "No Clients",
              label: search ? (
                `Searching "${search}"`
              ) : Object.keys(filters).length ? (
                `Filtering by '${Object.keys(filters).join(", ")}'`
              ) : (
                <Link label="Create Client" to="/app/clients/create" />
              ),
            })}
          />
        )}
      </Stack>
      {pageCount > 1 && (
        <Pagination
          count={pageCount}
          {...(pageCount > 10 && {
            showFirstButton: true,
            showLastButton: true,
          })}
          disabled={clientListQuery.isLoading}
          page={page}
          onChange={(_event, value) => onPageChange(value)}
          {...slotProps?.pagination}
          sx={[
            { alignSelf: "center" },
            ...sxUtils.asArray(slotProps?.pagination?.sx),
          ]}
        />
      )}
    </Stack>
  );
};

export default ClientList;
