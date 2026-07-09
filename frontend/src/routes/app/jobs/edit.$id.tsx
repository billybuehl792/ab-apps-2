import {
  createFileRoute,
  notFound,
  useCanGoBack,
  useRouter,
} from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Container, Stack, Typography } from "@mui/material";
import Breadcrumb from "@/components/links/Breadcrumb";
import useJob from "@/store/hooks/useJob";
import PageNotFoundCard from "@/components/cards/PageNotFoundCard";
import JobUpdateForm, {
  type IJobUpdateFormProps,
} from "@/containers/forms/JobUpdateForm";
import JobMenuOptionIconButton from "@/containers/buttons/JobMenuOptionIconButton";
import { jobQueries } from "@/store/queries/jobs";
import { JobIcons } from "@/store/constants/jobs";
import { errorUtils } from "@/store/utils/error";
import { idSchema } from "@/store/schemas/basic";
import { EJobOptionId } from "@/store/enums/jobs";
import { EObjectChangeType } from "@/store/enums/api";

const Crumb: React.FC = () => {
  /** Values */

  const params = Route.useParams();
  const label = `Edit Job ${String(params.id)}`;

  return (
    <Breadcrumb
      to="/app/jobs/edit/$id"
      params={params}
      children={label}
      startIcon={<JobIcons.Edit />}
    />
  );
};

const PageHeaderEndContentComponent: React.FC = () => {
  /** Values */

  const router = useRouter();
  const navigate = Route.useNavigate();
  const params = Route.useParams();

  /** Queries */

  const jobQuery = useQuery(jobQueries.job(params.id).detail);

  if (!jobQuery.data) return null;
  return (
    <JobMenuOptionIconButton
      job={jobQuery.data}
      hideOptions={[EJobOptionId.Edit]}
      onChange={(_, type) => {
        if (type === EObjectChangeType.Delete) {
          router.invalidate();
          navigate({ to: "/app/jobs", replace: true });
        }
      }}
    />
  );
};

export const Route = createFileRoute("/app/jobs/edit/$id")({
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
    crumb: { id: "jobs/edit/$id", Component: Crumb },
    PageHeaderEndContentComponent,
  },
});

function RouteComponent() {
  /** Values */

  const loaderData = Route.useLoaderData();
  const navigate = Route.useNavigate();
  const canGoBack = useCanGoBack();
  const router = useRouter();

  const jobHook = useJob(loaderData.job);
  const job = jobHook.job;

  /** Callbacks */

  const handleOnSubmit: IJobUpdateFormProps["onSubmit"] = (data) =>
    jobHook.mutations.update.mutateAsync(
      {
        categories: data.categories,
        description: data.description,
        recipients: data.recipients.map((contact) => contact.id),
        representatives: data.representatives.map((contact) => contact.id),
        google_place_id: data.place?.placePrediction.placeId,
      },
      {
        onSuccess: (newJob) => {
          router.invalidate();
          navigate({
            to: "/app/jobs/$id",
            params: { id: newJob.id },
            ignoreBlocker: true,
          });
        },
      },
    );

  const handleOnCancel = () => {
    if (canGoBack) router.history.back();
    else navigate({ to: "/app/jobs" });
  };

  return (
    <Container>
      <Stack spacing={2} py={2}>
        <Typography variant="h5">Edit Job</Typography>
        <JobUpdateForm
          values={{
            categories: job.categories,
            description: job.description,
            recipients: job.recipients,
            representatives: job.representatives,
            place: job.place
              ? {
                  placePrediction: {
                    placeId: job.place.google_place_id,
                    text: {
                      text: job.place.address_short,
                    },
                  },
                }
              : null,
          }}
          onSubmit={handleOnSubmit}
          onCancel={handleOnCancel}
        />
      </Stack>
    </Container>
  );
}
