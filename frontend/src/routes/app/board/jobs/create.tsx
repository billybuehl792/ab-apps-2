import {
  createFileRoute,
  useCanGoBack,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { Stack, Typography } from "@mui/material";
import { JobIcons } from "@/store/constants/jobs";
import StatusWrapper from "@/components/layout/StatusWrapper";
import JobCreateForm, {
  type IJobCreateFormProps,
} from "@/containers/forms/JobCreateForm";
import type { TRouteLoaderData } from "@/store/types/router";

export const Route = createFileRoute("/app/board/jobs/create")({
  loader: (): TRouteLoaderData => ({
    crumb: { label: "Create Job", Icon: JobIcons.Create },
  }),
  component: RouteComponent,
  pendingComponent: () => <StatusWrapper loading my={2} />,
});

function RouteComponent() {
  /** Values */

  const navigate = useNavigate();
  const router = useRouter();
  const canGoBack = useCanGoBack();

  /** Callbacks */

  const handleOnSuccess: IJobCreateFormProps["onSuccess"] = (newJob) =>
    navigate({
      to: "/app/board/jobs/$id",
      params: { id: String(newJob.id) },
      ignoreBlocker: true,
    });

  const handleOnCancel = () => {
    if (canGoBack) router.history.back();
    else navigate({ to: "/app/board/jobs" });
  };

  return (
    <Stack py={2} spacing={2}>
      <Typography variant="h5">Create New Job</Typography>
      <JobCreateForm onSuccess={handleOnSuccess} onCancel={handleOnCancel} />
    </Stack>
  );
}
