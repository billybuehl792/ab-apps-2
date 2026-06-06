import { type ComponentProps } from "react";
import {
  createFileRoute,
  useCanGoBack,
  useLoaderData,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { Container, Stack, Typography } from "@mui/material";
import { Edit } from "@mui/icons-material";
import useJob from "@/store/hooks/useJob";
import JobUpdateForm from "@/containers/forms/JobUpdateForm";
import type { TRouteLoaderData } from "@/store/types/router";

export const Route = createFileRoute("/app/jobs/$id/edit")({
  component: RouteComponent,
  loader: (): TRouteLoaderData => ({ crumb: { label: "Edit", Icon: Edit } }),
});

function RouteComponent() {
  /** Values */

  const loaderData = useLoaderData({ from: "/app/jobs/$id" });
  const navigate = useNavigate();
  const canGoBack = useCanGoBack();
  const router = useRouter();

  const jobHook = useJob(loaderData.data);
  const job = jobHook.job;

  /** Callbacks */

  const handleOnSuccess: ComponentProps<typeof JobUpdateForm>["onSuccess"] = (
    updatedJob,
  ) => {
    router.invalidate();
    navigate({
      to: "/app/jobs/$id",
      params: { id: String(updatedJob.id) },
      ignoreBlocker: true,
    });
  };

  const handleOnCancel = () => {
    if (canGoBack) router.history.back();
    else navigate({ to: "/app/jobs" });
  };

  return (
    <Stack component={Container} spacing={2} py={2}>
      <Stack>
        <Typography variant="h5">Edit Job</Typography>
      </Stack>
      {/* <JobUpdateForm
        job={job}
        onSuccess={handleOnSuccess}
        onCancel={handleOnCancel}
      /> */}
    </Stack>
  );
}
