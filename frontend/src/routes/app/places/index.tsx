import { createFileRoute, stripSearchParams } from "@tanstack/react-router";
import { Container } from "@mui/material";
import sanitizeSearchParams from "@/store/middleware/sanitizeSearchParams";
import PlaceList, { type IPlaceListProps } from "@/containers/lists/PlaceList";
import { placeListRequestSchema } from "@/store/schemas/places";

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

  /** Callbacks */

  const handleOnParamsChange: IPlaceListProps["onParamsChange"] = (newParams) =>
    navigate({
      to: ".",
      search: newParams,
      replace: true,
    });

  return (
    <Container sx={{ pb: 2 }}>
      <PlaceList
        params={params}
        onParamsChange={handleOnParamsChange}
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
