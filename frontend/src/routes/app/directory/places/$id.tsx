import { createFileRoute, notFound } from "@tanstack/react-router";
import { Stack, Typography } from "@mui/material";
import StatusWrapper from "@/components/layout/StatusWrapper";
import PlaceMapCard from "@/containers/cards/PlaceMapCard";
import { errorUtils } from "@/store/utils/error";
import { placeEndpoints, PlaceIcons } from "@/store/constants/places";
import { idSchema } from "@/store/schemas/basic";
import type { TPlace } from "@/store/types/places";
import type { TRouteLoaderData } from "@/store/types/router";

export const Route = createFileRoute("/app/directory/places/$id")({
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
  pendingComponent: () => <StatusWrapper loading="Loading Place..." my={2} />,
  component: RouteComponent,
});

function RouteComponent() {
  /** Values */

  const loaderData = Route.useLoaderData();

  return (
    <Stack spacing={2}>
      <Typography>{loaderData.data.address_full}</Typography>
      <PlaceMapCard place={loaderData.data} />
    </Stack>
  );
}
