import { createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowBack } from "@mui/icons-material";
import StatusWrapper from "@/components/layout/StatusWrapper";
import CustomLink from "@/components/links/CustomLink";
import { errorUtils } from "@/store/utils/error";
import type { TPlace } from "@/store/types/places";
import type { TRouteLoaderData } from "@/store/types/router";
import { idSchema } from "@/store/schemas/basic";
import { placeEndpoints, PlaceIcons } from "@/store/constants/places";

export const Route = createFileRoute("/app/dashboard/places/$id")({
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
  pendingComponent: () => <StatusWrapper loading="loading place..." my={2} />,
  notFoundComponent: () => (
    <StatusWrapper
      error={{
        label: "Place not found :(",
        actions: [<CustomLink label="Back" icon={<ArrowBack />} to=".." />],
      }}
      my={2}
    />
  ),
});
