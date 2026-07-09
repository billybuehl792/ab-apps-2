import {
  createFileRoute,
  useCanGoBack,
  useRouter,
} from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { Container, Stack, Typography } from "@mui/material";
import Breadcrumb from "@/components/links/Breadcrumb";
import JobCreateForm, {
  type IJobCreateFormProps,
} from "@/containers/forms/JobCreateForm";
import { jobMutations } from "@/store/mutations/jobs";
import { markdownUtils } from "@/store/utils/markdown";
import { errorUtils } from "@/store/utils/error";
import { JobIcons } from "@/store/constants/jobs";

export const Route = createFileRoute("/app/jobs/create")({
  component: RouteComponent,
  staticData: {
    crumb: {
      id: "/app/jobs/create",
      Component: () => (
        <Breadcrumb
          to="/app/jobs/create"
          children="Create"
          startIcon={<JobIcons.Create />}
        />
      ),
    },
  },
});

function RouteComponent() {
  /** Values */

  const navigate = Route.useNavigate();
  const router = useRouter();
  const canGoBack = useCanGoBack();
  const snackbar = useSnackbar();

  /** Mutations */

  const createJobMutation = useMutation({
    ...jobMutations.create,
    onSuccess: (res) =>
      snackbar.enqueueSnackbar(
        `${markdownUtils.bold(`Job ${res.id}`)} created successfully`,
        { variant: "success" },
      ),
    onError: (error) =>
      snackbar.enqueueSnackbar(errorUtils.getErrorMessage(error), {
        variant: "error",
      }),
  });

  /** Callbacks */

  const handleOnSubmit: IJobCreateFormProps["onSubmit"] = (data) =>
    createJobMutation.mutateAsync(
      {
        categories: data.categories,
        description: data.description,
        recipients: data.recipients.map((contact) => contact.id),
        representatives: data.representatives.map((contact) => contact.id),
        google_place_id: data.place?.placePrediction.placeId,
      },
      {
        onSuccess: (newJob) =>
          navigate({
            to: "/app/jobs/$id",
            params: { id: newJob.id },
            ignoreBlocker: true,
          }),
      },
    );

  const handleOnCancel = () => {
    if (canGoBack) router.history.back();
    else navigate({ to: "/app/jobs" });
  };

  return (
    <Container>
      <Stack spacing={2} py={2}>
        <Typography variant="h5">Create New Job</Typography>
        <JobCreateForm onSubmit={handleOnSubmit} onCancel={handleOnCancel} />
      </Stack>
    </Container>
  );
}
