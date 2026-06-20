import { createFileRoute, notFound } from "@tanstack/react-router";
import { Container, Stack } from "@mui/material";
import { placeEndpoints, PlaceIcons } from "@/store/constants/places";
import { errorUtils } from "@/store/utils/error";
import { idSchema } from "@/store/schemas/basic";
import PlaceDetailCard from "@/containers/cards/PlaceMapCard";
import PageNotFoundCard from "@/components/cards/PageNotFoundCard";

export const Route = createFileRoute("/app/places/$id")({
  beforeLoad: async ({ context, params }) => {
    try {
      const id = idSchema.parse(params.id);
      const place = await context.queryClient.fetchQuery({
        queryKey: placeEndpoints.place(id).id,
        queryFn: placeEndpoints.place(id).get,
      });
      return {
        place,
        crumb: { label: place.address_short, Icon: PlaceIcons.Detail },
      };
    } catch (error) {
      throw notFound({ data: errorUtils.getErrorMessage(error) });
    }
  },
  component: RouteComponent,
  notFoundComponent: () => (
    <Container>
      <PageNotFoundCard my={2} />
    </Container>
  ),
});

function RouteComponent() {
  /** Values */

  const context = Route.useRouteContext();

  return (
    <Container>
      <Stack spacing={1} py={2}>
        <PlaceDetailCard place={context.place} />
      </Stack>
    </Container>
  );
}
