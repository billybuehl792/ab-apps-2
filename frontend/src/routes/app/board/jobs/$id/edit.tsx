import { type ComponentProps } from "react";
import {
  createFileRoute,
  useCanGoBack,
  useLoaderData,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { Stack, Typography } from "@mui/material";
import useJob from "@/store/hooks/useJob";
import JobUpdateForm from "@/containers/forms/JobUpdateForm";

export const Route = createFileRoute("/app/board/jobs/$id/edit")({
  component: RouteComponent,
});

function RouteComponent() {
  /** Values */

  const loaderData = useLoaderData({ from: "/app/board/jobs/$id" });
  const navigate = useNavigate();
  const canGoBack = useCanGoBack();
  const router = useRouter();

  const jobHook = useJob(loaderData.data);
  const job = jobHook.job;

  const jobTitle = job.label || `Job #${job.id}`;

  /** Callbacks */

  const handleOnSuccess: ComponentProps<typeof JobUpdateForm>["onSuccess"] = (
    updatedJob,
  ) => {
    router.invalidate();
    navigate({
      to: "/app/board/jobs/$id",
      params: { id: String(updatedJob.id) },
      ignoreBlocker: true,
    });
  };

  const handleOnCancel = () => {
    if (canGoBack) router.history.back();
    else navigate({ to: "/app/board/jobs" });
  };

  return (
    <Stack spacing={2} my={2}>
      <Stack>
        <Typography variant="h5">Edit Job</Typography>
        <Typography variant="caption">{jobTitle}</Typography>
      </Stack>
      <JobUpdateForm
        job={job}
        onSuccess={handleOnSuccess}
        onCancel={handleOnCancel}
      />
    </Stack>
  );
}
