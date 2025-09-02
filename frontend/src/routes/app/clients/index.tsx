import { type ComponentProps } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { clientApi } from "@/store/api/clients";
import ClientList from "@/containers/lists/ClientList";
import { paramUtils } from "@/store/utils/params";
import { DEFAULT_PAGE_HEADER_HEIGHT } from "@/store/constants/layout";

const cleanSearch = (search: Record<string, unknown>) =>
  paramUtils.cleanSearch<NonNullable<Parameters<typeof clientApi.list>[0]>>(
    search
  );

export const Route = createFileRoute("/app/clients/")({
  validateSearch: (search) => cleanSearch(search),
  component: RouteComponent,
});

function RouteComponent() {
  /** Values */

  const params = Route.useSearch();
  const navigate = useNavigate();

  /** Callbacks */

  const onPageChange: ComponentProps<typeof ClientList>["onPageChange"] = (
    page
  ) =>
    navigate({
      to: "/app/clients",
      search: cleanSearch({ ...params, page }),
    });

  const onSearch: ComponentProps<typeof ClientList>["onSearch"] = (term) =>
    navigate({
      to: "/app/clients",
      search: cleanSearch({ ...params, page: 1, search: term }),
    });

  const onFilterAndSort: ComponentProps<
    typeof ClientList
  >["onFilterAndSort"] = (data) =>
    navigate({
      to: "/app/clients",
      search: cleanSearch({
        search: params.search,
        ordering: data.ordering?.value,
        ...data.filters.reduce((acc, f) => ({ ...acc, [f.value]: 1 }), {}),
      }),
    });

  return (
    <ClientList
      params={params}
      p={2}
      pt={0}
      onPageChange={onPageChange}
      onSearch={onSearch}
      onFilterAndSort={onFilterAndSort}
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
