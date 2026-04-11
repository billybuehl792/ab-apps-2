import { type ComponentProps, useState } from "react";
import {
  createFileRoute,
  useBlocker,
  useNavigate,
} from "@tanstack/react-router";
import { Stack, Typography } from "@mui/material";
import { JobIcons } from "@/store/constants/jobs";
import JobCreateForm from "@/containers/forms/JobCreateForm";
import useJob from "@/store/hooks/useJob";
import useConfirm from "@/store/hooks/useConfirm";
import { NULL_ID } from "@/store/constants/api";
import type { TRouteLoaderData } from "@/store/types/router";

export const Route = createFileRoute("/app/board/jobs/create")({
  loader: (): TRouteLoaderData => ({
    crumb: { label: "Create Job", Icon: JobIcons.Create },
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const [blockNavigation, setBlockNavigation] = useState(false);

  /** Values */

  const confirm = useConfirm();
  const navigate = useNavigate();

  const jobHook = useJob(NULL_ID);

  /** Callbacks */

  const handleOnSubmit: ComponentProps<typeof JobCreateForm>["onSubmit"] = (
    body,
  ) =>
    jobHook.mutations.create.mutateAsync(body, {
      onSuccess: (newJob) =>
        navigate({
          to: "/app/board/jobs/$id",
          params: { id: String(newJob.id) },
          ignoreBlocker: true,
        }),
    });

  const handleOnFormStateChange: ComponentProps<
    typeof JobCreateForm
  >["onFormStateChange"] = (formState) => setBlockNavigation(formState.isDirty);

  const handleOnCancel: ComponentProps<typeof JobCreateForm>["onCancel"] = () =>
    navigate({ to: ".." });

  /** Effects */

  useBlocker({
    shouldBlockFn: async () =>
      blockNavigation
        ? !(await confirm({
            title: "Unsaved Changes",
            description:
              "You have unsaved changes. Are you sure you want to leave?",
          }))
        : false,
  });

  return (
    <Stack spacing={2} my={2}>
      <Typography variant="h5">Create New Job</Typography>
      <JobCreateForm
        onFormStateChange={handleOnFormStateChange}
        onSubmit={handleOnSubmit}
        onCancel={handleOnCancel}
      />
    </Stack>
  );
}
