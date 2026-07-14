import { createFileRoute, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Container, Skeleton, Stack } from "@mui/material";
import UserDetailCard from "@/containers/cards/UserDetailCard";
import Breadcrumb from "@/components/links/Breadcrumb";
import { accountQueries } from "@/store/queries/account";
import { idSchema } from "@/store/schemas/basic";
import { AccountIcons } from "@/store/constants/account";
import { errorUtils } from "@/store/utils/error";

const Crumb: React.FC = () => {
  /** Values */

  const params = Route.useParams();

  /** Queries */

  const userQuery = useQuery(accountQueries.users.user(params.id).detail);

  if (userQuery.isPending) return <Skeleton variant="text" width={100} />;
  if (userQuery.isError || !userQuery.data) return <span>-</span>;
  return (
    <Breadcrumb
      to="/app/profile/$id"
      params={{ id: params.id }}
      startIcon={<AccountIcons.Detail />}
      children={userQuery.data.username}
      activeOptions={{ exact: false, includeSearch: false }}
    />
  );
};

export const Route = createFileRoute("/app/profile/$id")({
  params: {
    parse: ({ id }) => {
      const parsed = idSchema.safeParse(id);
      return parsed.success ? { id: parsed.data } : false;
    },
  },
  loader: async ({ context, params }) => {
    try {
      const user = await context.queryClient.fetchQuery(
        accountQueries.users.user(params.id).detail,
      );
      return { user };
    } catch (error) {
      throw notFound({ data: errorUtils.getErrorMessage(error) });
    }
  },
  component: RouteComponent,
  staticData: { crumb: { id: "/app/profile/$id", Component: Crumb } },
});

function RouteComponent() {
  /** Values */

  const loaderData = Route.useLoaderData();

  return (
    <Container>
      <Stack mt={2}>
        <UserDetailCard user={loaderData.user} />
      </Stack>
    </Container>
  );
}
