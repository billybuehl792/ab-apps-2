import {
  createFileRoute,
  notFound,
  Outlet,
  useChildMatches,
  useRouter,
} from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Container,
  Skeleton,
  Stack,
  Tab,
  Tabs,
  type TabsProps,
} from "@mui/material";
import ContactMenuOptionIconButton from "@/containers/buttons/ContactMenuOptionIconButton";
import PageNotFoundCard from "@/components/cards/PageNotFoundCard";
import ContactDetailCard from "@/containers/cards/ContactDetailCard";
import Breadcrumb from "@/components/links/Breadcrumb";
import { contactQueries } from "@/store/queries/contacts";
import { errorUtils } from "@/store/utils/error";
import { idSchema } from "@/store/schemas/basic";
import { EContactOptionId } from "@/store/enums/contacts";
import { EObjectChangeType } from "@/store/enums/api";
import { ContactIcons } from "@/store/constants/contacts";

enum ETabs {
  Overview = "Overview",
  Jobs = "Jobs",
  Documents = "Documents",
  History = "History",
}

const PageHeaderEndContentComponent: React.FC = () => {
  /** Values */

  const router = useRouter();
  const loaderData = Route.useLoaderData();
  const navigate = Route.useNavigate();

  if (!loaderData?.contact) return null;
  return (
    <ContactMenuOptionIconButton
      contact={loaderData.contact}
      hideOptions={[EContactOptionId.Detail]}
      onChange={(_, type) => {
        if (type === EObjectChangeType.Delete) {
          navigate({
            to: "/app/contacts",
            replace: true,
          }).then(() => router.invalidate());
        }
      }}
    />
  );
};

const Crumb: React.FC = () => {
  /** Values */

  const params = Route.useParams();

  /** Queries */

  const contactQuery = useQuery(
    contactQueries.contact(Number(params.id)).detail,
  );

  if (contactQuery.isPending) return <Skeleton variant="text" width={100} />;
  if (contactQuery.isError || !contactQuery.data) return <span>-</span>;
  return (
    <Breadcrumb
      to="/app/contacts/$id"
      params={{ id: params.id }}
      startIcon={<ContactIcons.Detail />}
      children={`${contactQuery.data.first_name} ${contactQuery.data.last_name}`}
      activeOptions={{ exact: false, includeSearch: false }}
    />
  );
};

export const Route = createFileRoute("/app/contacts/$id")({
  params: {
    parse: ({ id }) => {
      const parsed = idSchema.safeParse(id);
      return parsed.success ? { id: parsed.data } : false;
    },
  },
  loader: async ({ context, params }) => {
    try {
      const contact = await context.queryClient.fetchQuery(
        contactQueries.contact(params.id).detail,
      );
      return { contact };
    } catch (error) {
      throw notFound({ data: errorUtils.getErrorMessage(error) });
    }
  },
  component: RouteComponent,
  notFoundComponent: () => (
    <Container>
      <PageNotFoundCard
        label="Contact not found"
        description="The contact you are looking for does not exist or has been removed."
        my={2}
      />
    </Container>
  ),
  staticData: {
    crumb: { id: "contacts/contact/$id", Component: Crumb },
    PageHeaderEndContentComponent,
  },
});

function RouteComponent() {
  /** Values */

  const loaderData = Route.useLoaderData();
  const navigate = Route.useNavigate();
  const activeTabId = useChildMatches({
    select: (matches) => matches[0]?.routeId,
  });

  const { contact } = loaderData;

  const tab =
    activeTabId === "/app/contacts/$id/jobs"
      ? ETabs.Jobs
      : activeTabId === "/app/contacts/$id/documents"
        ? ETabs.Documents
        : activeTabId === "/app/contacts/$id/history"
          ? ETabs.History
          : ETabs.Overview;

  /** Callbacks */

  const handleOnTabChange: TabsProps["onChange"] = (_, newTab) => {
    if (newTab === tab) return;

    if (newTab === ETabs.Jobs)
      navigate({ to: "/app/contacts/$id/jobs", replace: true });
    else if (newTab === ETabs.Documents)
      navigate({ to: "/app/contacts/$id/documents", replace: true });
    else if (newTab === ETabs.History)
      navigate({ to: "/app/contacts/$id/history", replace: true });
    else navigate({ to: ".", replace: true });
  };

  return (
    <Stack width="100%" height="100%" overflow="auto">
      <Container sx={{ mt: 2 }}>
        {!!contact && <ContactDetailCard contact={contact} sx={{ mb: 1 }} />}
        <Tabs
          value={tab}
          variant="scrollable"
          scrollButtons={false}
          onChange={handleOnTabChange}
        >
          {Object.values(ETabs).map((tab) => (
            <Tab key={tab} value={tab} label={tab} />
          ))}
        </Tabs>
      </Container>
      <Outlet />
    </Stack>
  );
}
