import {
  createFileRoute,
  stripSearchParams,
  useNavigate,
} from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import z from "zod";
import PlaceList from "@/containers/lists/PlaceList";
import PlaceCreateButton from "@/containers/buttons/PlaceCreateButton";
import { placeListRequestSchema } from "@/store/schemas/places";
import type { TRouteLoaderData } from "@/store/types/router";

const paramsSchema = placeListRequestSchema.shape.params;
const defaultParams = paramsSchema.parse({});

export const Route = createFileRoute("/app/directory/places/")({
  validateSearch: zodValidator(fallback(paramsSchema, defaultParams)),
  search: { middlewares: [stripSearchParams(defaultParams)] },
  component: RouteComponent,
  loader: (): TRouteLoaderData => {
    return { slotProps: { pageHeader: { endContent: <PlaceCreateButton /> } } };
  },
});

function RouteComponent() {
  /** Values */

  const params = Route.useSearch();
  const navigate = useNavigate();

  /** Callbacks */

  const handleOnParamsChange = (
    newParams: z.input<typeof placeListRequestSchema.shape.params>,
  ) =>
    navigate({
      to: ".",
      search: placeListRequestSchema.shape.params.parse(newParams),
      replace: true,
    });

  return (
    <PlaceList
      params={params}
      onParamsChange={(newParams) => handleOnParamsChange(newParams)}
      mb={2}
      slotProps={{
        header: {
          sx: {
            position: "sticky",
            top: (theme) => theme.layout.page.header.height,
            bgcolor: "background.paper",
            zIndex: 1,
          },
        },
      }}
    />
  );
}
