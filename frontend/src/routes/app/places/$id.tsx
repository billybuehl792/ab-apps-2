import { createFileRoute, notFound } from "@tanstack/react-router";
import { Container, Stack } from "@mui/material";
import { placeEndpoints, PlaceIcons } from "@/store/constants/places";
import { errorUtils } from "@/store/utils/error";
import { idSchema } from "@/store/schemas/basic";
import PlaceDetailCard from "@/containers/cards/PlaceMapCard";
import type { TRouteLoaderData } from "@/store/types/router";
import type { TPlace } from "@/store/types/places";

export const Route = createFileRoute("/app/places/$id")({
  loader: async ({ context, params }): Promise<TRouteLoaderData<TPlace>> => {
    try {
      const placeId = idSchema.parse(params.id);
      const place = await context.queryClient.fetchQuery({
        queryKey: placeEndpoints.place(placeId).id,
        queryFn: placeEndpoints.place(placeId).get,
      });

      return {
        data: place,
        crumb: { label: place.address_short, Icon: PlaceIcons.Detail },
      };
    } catch (error) {
      throw notFound({ data: errorUtils.getErrorMessage(error) });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  /** Values */

  const loaderData = Route.useLoaderData();

  const place = loaderData.data;

  return (
    <Container maxWidth="md">
      <Stack spacing={1} py={2}>
        <PlaceDetailCard place={place} />
      </Stack>
    </Container>
  );
}
