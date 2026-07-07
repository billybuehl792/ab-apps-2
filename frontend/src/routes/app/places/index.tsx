import { createFileRoute, stripSearchParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Container } from "@mui/material";
import sanitizeSearchParams from "@/store/middleware/sanitizeSearchParams";
import usePlace from "@/store/hooks/usePlace";
import PlaceList from "@/containers/lists/PlaceList";
import PlaceListCard, {
  type IPlaceListCardProps,
} from "@/containers/lists/PlaceList/components/cards/PlaceListCard";
import { placeQueries } from "@/store/queries/places";
import { placeListRequestSchema } from "@/store/schemas/places";
import { EPlaceOptionId } from "@/store/enums/places";

const paramsSchema = placeListRequestSchema.shape.params;
const defaultParams = paramsSchema.parse({});

export const Route = createFileRoute("/app/places/")({
  validateSearch: paramsSchema,
  search: {
    middlewares: [
      sanitizeSearchParams(paramsSchema),
      stripSearchParams(defaultParams),
    ],
  },
  component: RouteComponent,
  beforeLoad: () => ({ crumb: null }),
});

function RouteComponent() {
  /* Values */

  const params = Route.useSearch();
  const navigate = Route.useNavigate();

  /** Queries */

  const placeListQuery = useQuery(placeQueries.list({ params }));

  /** Callbacks */

  const handleOnParamsChange = (newParams: Partial<typeof params>) =>
    navigate({
      to: ".",
      search: (s) => ({ ...s, ...newParams }),
      replace: true,
    });

  return (
    <Container sx={{ pb: 2 }}>
      <PlaceList
        items={placeListQuery.data?.results ?? []}
        count={placeListQuery.data?.count ?? -1}
        page={params.page}
        pageSize={params.page_size}
        search={params.search}
        loading={placeListQuery.isLoading}
        error={placeListQuery.error}
        onPageChange={(page) => handleOnParamsChange({ page })}
        onPageSizeChange={(page_size) =>
          handleOnParamsChange({ page: 1, page_size })
        }
        onSearchChange={(search) => handleOnParamsChange({ page: 1, search })}
        renderCard={(place) => <ListCard place={place} />}
        slotProps={{
          header: {
            position: "sticky",
            top: 0,
            zIndex: 1,
            bgcolor: "background.paper",
          },
        }}
      />
    </Container>
  );
}

const ListCard: React.FC<IPlaceListCardProps> = ({ place, ...props }) => {
  /** Values */

  const { options } = usePlace(place, { hideOptions: [EPlaceOptionId.Delete] });

  return (
    <PlaceListCard
      place={place}
      options={options}
      link={{ to: "/app/places/$id", params: { id: String(place.id) } }}
      {...props}
    />
  );
};
