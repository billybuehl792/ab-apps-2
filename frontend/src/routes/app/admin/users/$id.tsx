import { createFileRoute, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Container, Skeleton } from "@mui/material";
import UserDetailCard from "@/containers/cards/UserDetailCard";
import PageNotFoundCard from "@/components/cards/PageNotFoundCard";
import Breadcrumb from "@/components/links/Breadcrumb";
import { idSchema } from "@/store/schemas/basic";
import { accountQueries } from "@/store/queries/account";
import { errorUtils } from "@/store/utils/error";
import { AccountIcons } from "@/store/constants/account";

const Crumb: React.FC = () => {
  /** Values */

  const params = Route.useParams();

  /** Queries */

  const userQuery = useQuery(
    accountQueries.users.user(Number(params.id)).detail,
  );

  if (userQuery.isPending) return <Skeleton variant="text" width={100} />;
  if (userQuery.isError || !userQuery.data) return <span>-</span>;
  return (
    <Breadcrumb
      to="/app/admin/users/$id"
      params={{ id: params.id }}
      startIcon={<AccountIcons.users.Detail />}
      children={userQuery.data.username}
      activeOptions={{ exact: false, includeSearch: false }}
    />
  );
};

export const Route = createFileRoute("/app/admin/users/$id")({
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
  notFoundComponent: () => (
    <Container>
      <PageNotFoundCard
        label="User not found"
        description="The user you are looking for does not exist or has been removed."
        my={2}
      />
    </Container>
  ),
  staticData: { crumb: { id: "app/admin/users/$id", Component: Crumb } },
});

function RouteComponent() {
  /** Values */

  const { user } = Route.useLoaderData();

  return (
    <Container sx={{ mt: 2 }}>
      <UserDetailCard user={user} />
    </Container>
  );
}
