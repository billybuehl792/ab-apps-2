import { useState, type ComponentProps } from "react";
import {
  createFileRoute,
  useBlocker,
  useLoaderData,
  useNavigate,
} from "@tanstack/react-router";
import { Stack, Typography } from "@mui/material";
import { Edit } from "@mui/icons-material";
import useClient from "@/store/hooks/useClient";
import useConfirm from "@/store/hooks/useConfirm";
import ClientUpdateForm from "@/containers/forms/ClientUpdateForm";
import type { TRouteLoaderData } from "@/store/types/router";

export const Route = createFileRoute("/app/dashboard/clients/$id/edit")({
  component: RouteComponent,
  loader: (): TRouteLoaderData => ({ crumb: { label: "Edit", Icon: Edit } }),
});

function RouteComponent() {
  const [blockNavigation, setBlockNavigation] = useState(false);

  /** Values */

  const loaderData = useLoaderData({ from: "/app/dashboard/clients/$id" });
  const navigate = useNavigate();
  const confirm = useConfirm();

  const clientHook = useClient(loaderData.data);

  /** Callbacks */

  const handleOnSubmit: ComponentProps<typeof ClientUpdateForm>["onSubmit"] = (
    data,
  ) =>
    clientHook.mutations.update.mutateAsync(data, {
      onSuccess: (updatedClient) => {
        setBlockNavigation(false);
        navigate({
          to: "/app/dashboard/clients/$id",
          params: { id: String(updatedClient.id) },
        });
      },
    });

  const handleOnFormStateChange: ComponentProps<
    typeof ClientUpdateForm
  >["onFormStateChange"] = (formState) => setBlockNavigation(formState.isDirty);

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
      <Stack>
        <Typography variant="h5">Edit Client</Typography>
        <Typography variant="caption">{clientHook.client.full_name}</Typography>
      </Stack>
      <ClientUpdateForm
        client={clientHook.client}
        onFormStateChange={handleOnFormStateChange}
        onSubmit={handleOnSubmit}
      />
    </Stack>
  );
}
