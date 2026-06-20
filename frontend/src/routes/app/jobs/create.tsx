import {
  createFileRoute,
  useCanGoBack,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { Container, Stack, Typography } from "@mui/material";
import { JobIcons } from "@/store/constants/jobs";
import JobCreateForm, {
  type IJobCreateFormProps,
} from "@/containers/forms/JobCreateForm";
import { jobEndpoints } from "@/store/constants/jobs";
import { useMutation } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { markdownUtils } from "@/store/utils/markdown";
import { errorUtils } from "@/store/utils/error";
import { EObjectChangeType } from "@/store/enums/api";

export const Route = createFileRoute("/app/jobs/create")({
  beforeLoad: () => ({
    crumb: { label: "Create", Icon: JobIcons.Create },
  }),
  component: RouteComponent,
});

function RouteComponent() {
  /** Values */

  const navigate = useNavigate();
  const router = useRouter();
  const snackbar = useSnackbar();
  const canGoBack = useCanGoBack();

  /** Mutations */

  const createJobMutation = useMutation({
    mutationKey: [jobEndpoints.id, EObjectChangeType.Create],
    mutationFn: jobEndpoints.post,
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
            params: { id: String(newJob.id) },
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
