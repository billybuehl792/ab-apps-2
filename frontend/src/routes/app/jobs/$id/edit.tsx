import {
  createFileRoute,
  useCanGoBack,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { Container, Stack, Typography } from "@mui/material";
import { Edit } from "@mui/icons-material";
import useJob from "@/store/hooks/useJob";
import JobUpdateForm, {
  type IJobUpdateFormProps,
} from "@/containers/forms/JobUpdateForm";

export const Route = createFileRoute("/app/jobs/$id/edit")({
  component: RouteComponent,
  beforeLoad: () => ({ crumb: { label: "Edit", Icon: Edit } }),
});

function RouteComponent() {
  /** Values */

  const context = Route.useRouteContext();
  const navigate = useNavigate();
  const canGoBack = useCanGoBack();
  const router = useRouter();

  const jobHook = useJob(context.job);
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
            params: { id: String(newJob.id) },
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
        <Stack>
          <Typography variant="h5">Edit Job</Typography>
        </Stack>
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
