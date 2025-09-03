import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { clientQueries } from "@/store/queries/clients";
import PaginatedList from "@/components/lists/PaginatedList";
import ClientListCard from "@/containers/cards/ClientListCard";
import { DEFAULT_PAGE_HEADER_HEIGHT } from "@/store/constants/layout";
import { paramUtils } from "@/store/utils/params";

type Params = NonNullable<Parameters<typeof clientQueries.list>[0]>;

const cleanParams = (params: Record<string, unknown>) =>
  paramUtils.cleanApiListRequestParams<Params>(params);

const ORDERING_OPTIONS = [
  { value: "first_name", label: "First Name" },
  { value: "last_name", label: "Last Name" },
] as const;
const FILTER_OPTIONS = [{ id: "has_email", value: 1, label: "Has Email" }];

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

  const handlePageChange = (page: number) =>
    navigate({
      to: "/app/clients",
      search: cleanParams({ ...params, page }),
    });

  const handleSearch = (term: string) =>
    navigate({
      to: "/app/clients",
      search: cleanParams({ ...params, page: 1, search: term }),
    });

  const handleOrderingAndFiltersChange = (res: {
    ordering?: (typeof ORDERING_OPTIONS)[number];
    filters?: (typeof FILTER_OPTIONS)[number][];
  }) =>
    navigate({
      to: "/app/clients",
      search: cleanParams({
        page: undefined,
        search: params.search,
        ordering: res.ordering?.value,
        ...res.filters?.reduce((acc, f) => ({ ...acc, [f.id]: f.value }), {}),
      }),
    });

  return (
    <PaginatedList
      queryOptions={queryOptions}
      orderingAndFiltersOptions={{
        ordering: ORDERING_OPTIONS,
        filters: FILTER_OPTIONS,
      }}
      renderItem={(client) => (
        <ClientListCard key={client.id} client={client} />
      )}
      onPageChange={handlePageChange}
      onSearch={handleSearch}
      onOrderingAndFiltersChange={handleOrderingAndFiltersChange}
      sx={{ p: 2, pt: 0 }}
      slotProps={{
        header: {
          position: "sticky",
          top: DEFAULT_PAGE_HEADER_HEIGHT,
          pt: 2,
          bgcolor: (theme) => theme.palette.background.paper,
          zIndex: 1,
        },
      }}
    />
  );
}
