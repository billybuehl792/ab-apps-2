import { useMemo } from "react";
import {
  createFileRoute,
  stripSearchParams,
  useNavigate,
} from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import z from "zod";
import { Add } from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import { placeEndpoints } from "@/store/constants/places";
import { placeListRequestSchema } from "@/store/schemas/places";
import type { TRouteLoaderData } from "@/store/types/router";
import PlaceList, { type IPlaceListProps } from "@/containers/lists/PlaceList";
import { EObjectChangeType } from "@/store/enums/api";
import ButtonLink from "@/components/links/ButtonLink";

const paramsSchema = placeListRequestSchema.shape.params;
const defaultParams = paramsSchema.parse({});

export const Route = createFileRoute("/app/directory/places/")({
  validateSearch: zodValidator(fallback(paramsSchema, defaultParams)),
  search: { middlewares: [stripSearchParams(defaultParams)] },
  component: RouteComponent,
  loader: (): TRouteLoaderData => {
    return {
      slotProps: {
        pageHeader: {
          endContent: (
            <ButtonLink
              to="/app/directory/places/create"
              children="Create"
              startIcon={<Add />}
              variant="text"
            />
          ),
        },
      },
    };
  },
});

function RouteComponent() {
  /** Values */

  const params = Route.useSearch();
  const navigate = useNavigate();

  /** Queries */

  const placeListQuery = useQuery({
    queryKey: [placeEndpoints.id, { params }],
    queryFn: () => placeEndpoints.get({ params }),
  });

  /** Data */

  const total = useMemo(
    () => placeListQuery.data?.count ?? false,
    [placeListQuery.data],
  );

  /** Callbacks */

  const handleOnParamsChange = (
    newParams: z.input<typeof placeListRequestSchema.shape.params>,
  ) =>
    navigate({
      to: ".",
      search: placeListRequestSchema.shape.params.parse({
        ...params,
        ...newParams,
      }),
      replace: true,
    });

  const handleOnCardChange: IPlaceListProps["onCardChange"] = (place, type) => {
    if (type === EObjectChangeType.Delete) {
      const isLastItemOnPage =
        placeListQuery.data?.results.at(-1)?.id === place.id;
      const isFirstPage = params.page === 1;
      if (isLastItemOnPage && !isFirstPage)
        handleOnParamsChange({ page: params.page - 1 });
      else placeListQuery.refetch();
    }
  };

  return (
    <PlaceList
      items={placeListQuery.data?.results ?? []}
      total={total}
      options={{ params }}
      loading={placeListQuery.isLoading}
      error={placeListQuery.error}
      renderSkeletonItem
      mb={2}
      onCardChange={handleOnCardChange}
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
