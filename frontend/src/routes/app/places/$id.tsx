import { createFileRoute, notFound } from "@tanstack/react-router";
import { Container, Stack } from "@mui/material";
import { PlaceIcons } from "@/store/constants/places";
import PlaceDetailCard from "@/containers/cards/PlaceMapCard";
import PageNotFoundCard from "@/components/cards/PageNotFoundCard";
import { placeQueries } from "@/store/queries/places";
import { errorUtils } from "@/store/utils/error";

export const Route = createFileRoute("/app/places/$id")({
  beforeLoad: async ({ context, params }) => {
    try {
      const id = Number(params.id);
      if (isNaN(id)) throw new Error("Invalid place ID");

      const place = await context.queryClient.fetchQuery(
        placeQueries.place(id).detail,
      );
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
