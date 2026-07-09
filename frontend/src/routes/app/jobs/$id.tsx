import {
  createFileRoute,
  notFound,
  Outlet,
  useChildMatches,
  useRouter,
} from "@tanstack/react-router";
import { Container, Stack, Tab, Tabs, type TabsProps } from "@mui/material";
import Breadcrumb from "@/components/links/Breadcrumb";
import PageNotFoundCard from "@/components/cards/PageNotFoundCard";
import JobMenuOptionIconButton from "@/containers/buttons/JobMenuOptionIconButton";
import JobDetailCard from "@/containers/cards/JobDetailCard";
import { errorUtils } from "@/store/utils/error";
import { jobQueries } from "@/store/queries/jobs";
import { idSchema } from "@/store/schemas/basic";
import { EObjectChangeType } from "@/store/enums/api";
import { JobIcons } from "@/store/constants/jobs";
import { EJobOptionId } from "@/store/enums/jobs";

enum ETabs {
  Overview = "Overview",
  Documents = "Documents",
  History = "History",
}

const PageHeaderEndContentComponent: React.FC = () => {
  /** Values */

  const router = useRouter();
  const loaderData = Route.useLoaderData();
  const navigate = Route.useNavigate();

  if (!loaderData?.job) return null;
  return (
    <JobMenuOptionIconButton
      job={loaderData.job}
      hideOptions={[EJobOptionId.Detail]}
      onChange={(_, type) => {
        if (type === EObjectChangeType.Delete) {
          navigate({
            to: "/app/jobs",
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

  return (
    <Breadcrumb
      to="/app/jobs/$id"
      params={{ id: params.id }}
      startIcon={<JobIcons.Detail />}
      children={`Job ${params.id}`}
      activeOptions={{ exact: false, includeSearch: false }}
    />
  );
};
export const Route = createFileRoute("/app/jobs/$id")({
  params: {
    parse: ({ id }) => {
      const parsed = idSchema.safeParse(id);
      return parsed.success ? { id: parsed.data } : false;
    },
  },
  loader: async ({ context, params }) => {
    try {
      const job = await context.queryClient.fetchQuery(
        jobQueries.job(params.id).detail,
      );
      return { job };
    } catch (error) {
      throw notFound({ data: errorUtils.getErrorMessage(error) });
    }
  },
  component: RouteComponent,
  notFoundComponent: () => (
    <Container>
      <PageNotFoundCard
        label="Job not found"
        description="The job you are looking for does not exist or has been removed."
        my={2}
      />
    </Container>
  ),
  staticData: {
    crumb: { id: "app/jobs/$id", Component: Crumb },
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

  const { job } = loaderData;

  const tab =
    activeTabId === "/app/jobs/$id/documents"
      ? ETabs.Documents
      : activeTabId === "/app/jobs/$id/history"
        ? ETabs.History
        : ETabs.Overview;

  /** Callbacks */

  const handleOnTabChange: TabsProps["onChange"] = (_, newTab) => {
    if (newTab === tab) return;

    if (newTab === ETabs.Documents)
      navigate({ to: "/app/jobs/$id/documents", replace: true });
    else if (newTab === ETabs.History)
      navigate({ to: "/app/jobs/$id/history", replace: true });
    else navigate({ to: ".", replace: true });
  };

  return (
    <Stack width="100%" height="100%" overflow="auto">
      <Container sx={{ mt: 2 }}>
        <JobDetailCard job={job} />
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
