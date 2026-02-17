import { type ComponentProps, useMemo } from "react";
import {
  createFileRoute,
  stripSearchParams,
  useNavigate,
} from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import z from "zod";
import { Add } from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import { clientListRequestSchema } from "@/store/schemas/clients";
import CustomLink from "@/components/links/CustomLink";
import ClientList from "@/containers/lists/ClientList";
import StatusWrapper from "@/components/layout/StatusWrapper";
import { clientEndpoints } from "@/store/constants/clients";
import { EObjectChangeType } from "@/store/enums/api";
import type { TRouteLoaderData } from "@/store/types/router";

const paramsSchema = clientListRequestSchema.shape.params;
const defaultParams = paramsSchema.parse({});

export const Route = createFileRoute("/app/dashboard/clients/")({
  validateSearch: zodValidator(fallback(paramsSchema, defaultParams)),
  search: { middlewares: [stripSearchParams(defaultParams)] },
  pendingComponent: () => <StatusWrapper loading my={2} />,
  errorComponent: ({ error }) => <StatusWrapper error={error} my={2} />,
  component: RouteComponent,
  loader: (): TRouteLoaderData => ({
    slotProps: {
      pageHeader: {
        endContent: (
          <CustomLink
            label="Create"
            to="/app/dashboard/clients/create"
            icon={<Add />}
          />
        ),
      },
    },
  }),
});

function RouteComponent() {
  /** Values */

  const params = Route.useSearch();
  const navigate = useNavigate();

  /** Queries */

  const clientListQuery = useQuery({
    queryKey: [clientEndpoints.id, { params }],
    queryFn: () => clientEndpoints.get({ params }),
  });

  /** Data */

  const total = useMemo(
    () => clientListQuery.data?.count ?? false,
    [clientListQuery.data],
  );

  /** Callbacks */

  const handleOnParamsChange = (
    newParams: z.input<typeof clientListRequestSchema.shape.params>,
  ) =>
    navigate({
      to: "/app/dashboard/clients",
      search: clientListRequestSchema.shape.params.parse({
        ...params,
        ...newParams,
      }),
      replace: true,
    });

  const handleOnChange: ComponentProps<typeof ClientList>["onChange"] = (
    client,
    type,
  ) => {
    if (type === EObjectChangeType.Delete) {
      const isLastItemOnPage =
        clientListQuery.data?.results.at(-1)?.id === client.id;
      const isFirstPage = params.page === 1;
      if (isLastItemOnPage && !isFirstPage)
        handleOnParamsChange({ page: params.page - 1 });
      else clientListQuery.refetch();
    }
  };

  return (
    <ClientList
      items={clientListQuery.data?.results ?? []}
      total={total}
      options={{ params }}
      loading={clientListQuery.isLoading}
      error={clientListQuery.error}
      renderSkeletonItem
      mb={2}
      onChange={handleOnChange}
      onPageChange={(_event, page) => handleOnParamsChange({ page })}
      onSearchChange={(value) =>
        handleOnParamsChange({ search: value, page: 1 })
      }
      onOrderingChange={(value) =>
        handleOnParamsChange({ ordering: value, page: 1 })
      }
      slotProps={{
        header: {
          position: "sticky",
          top: (theme) => theme.layout.page.header.height,
          bgcolor: "background.paper",
          zIndex: 1,
        },
      }}
    />
  );
}
