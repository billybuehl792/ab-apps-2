import { createFileRoute, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Container, Skeleton, Stack } from "@mui/material";
import { PlaceIcons } from "@/store/constants/places";
import PlaceDetailCard from "@/containers/cards/PlaceMapCard";
import PageNotFoundCard from "@/components/cards/PageNotFoundCard";
import Breadcrumb from "@/components/links/Breadcrumb";
import { idSchema } from "@/store/schemas/basic";
import { placeQueries } from "@/store/queries/places";
import { errorUtils } from "@/store/utils/error";

const Crumb: React.FC = () => {
  /** Values */

  const params = Route.useParams();

  /** Queries */

  const placeQuery = useQuery(placeQueries.place(params.id).detail);

  if (placeQuery.isPending) return <Skeleton variant="text" width={100} />;
  if (placeQuery.isError || !placeQuery.data) return <span>-</span>;
  return (
    <Breadcrumb
      to="/app/places/$id"
      params={{ id: params.id }}
      startIcon={<PlaceIcons.Detail />}
      children={placeQuery.data.address_short}
      activeOptions={{ exact: false, includeSearch: false }}
    />
  );
};

export const Route = createFileRoute("/app/places/$id")({
  params: {
    parse: ({ id }) => {
      const parsed = idSchema.safeParse(id);
      return parsed.success ? { id: parsed.data } : false;
    },
  },
  loader: async ({ context, params }) => {
    try {
      const place = await context.queryClient.fetchQuery(
        placeQueries.place(params.id).detail,
      );
      return { place };
    } catch (error) {
      throw notFound({ data: errorUtils.getErrorMessage(error) });
    }
  },
  component: RouteComponent,
  notFoundComponent: () => (
    <Container>
      <PageNotFoundCard
        label="Place not found"
        description="The place you are looking for does not exist or has been removed."
        my={2}
      />
    </Container>
  ),
  staticData: { crumb: { id: "places/place/$id", Component: Crumb } },
});

function RouteComponent() {
  /** Values */

  const loaderData = Route.useLoaderData();
  const { place } = loaderData;

  return (
    <Container>
      <Stack spacing={1} py={2}>
        <PlaceDetailCard place={place} />
      </Stack>
    </Container>
  );
}
