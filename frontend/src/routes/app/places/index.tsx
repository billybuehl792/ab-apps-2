import {
  createFileRoute,
  stripSearchParams,
  useNavigate,
} from "@tanstack/react-router";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import { Container } from "@mui/material";
import PlaceList, { type IPlaceListProps } from "@/containers/lists/PlaceList";
import { placeListRequestSchema } from "@/store/schemas/places";

const paramsSchema = placeListRequestSchema.shape.params;
const defaultParams = paramsSchema.parse({});

export const Route = createFileRoute("/app/places/")({
  validateSearch: zodValidator(fallback(paramsSchema, defaultParams)),
  search: { middlewares: [stripSearchParams(defaultParams)] },
  component: RouteComponent,
});

function RouteComponent() {
  /* Values */

  const params = Route.useSearch();
  const navigate = useNavigate();

  /** Callbacks */

  const handleOnParamsChange: IPlaceListProps["onParamsChange"] = (newParams) =>
    navigate({
      to: ".",
      search: paramsSchema.parse(newParams),
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
