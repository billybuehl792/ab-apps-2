import { useState, type ComponentProps } from "react";
import {
  createFileRoute,
  useBlocker,
  useNavigate,
} from "@tanstack/react-router";
import { Stack, Typography } from "@mui/material";
import useClient from "@/store/hooks/useClient";
import useConfirm from "@/store/hooks/useConfirm";
import ClientCreateForm from "@/containers/forms/ClientCreateForm";
import { ClientIcons } from "@/store/constants/clients";
import { NULL_ID } from "@/store/constants/api";
import type { TRouteLoaderData } from "@/store/types/router";

export const Route = createFileRoute("/app/dashboard/clients/create")({
  loader: (): TRouteLoaderData => ({
    crumb: { label: "Create Client", Icon: ClientIcons.Create },
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const [blockNavigation, setBlockNavigation] = useState(false);

  /** Values */

  const confirm = useConfirm();
  const navigate = useNavigate();

  const clientHook = useClient(NULL_ID);

  /** Callbacks */

  const handleOnSubmit: ComponentProps<typeof ClientCreateForm>["onSubmit"] = (
    body,
  ) =>
    clientHook.mutations.create.mutateAsync(body, {
      onSuccess: (newClient) =>
        navigate({
          to: "/app/dashboard/clients/$id",
          params: { id: String(newClient.id) },
          ignoreBlocker: true,
        }),
    });

  const handleOnFormStateChange: ComponentProps<
    typeof ClientCreateForm
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
      <Typography variant="h5">Create New Client</Typography>
      <ClientCreateForm
        onFormStateChange={handleOnFormStateChange}
        onSubmit={handleOnSubmit}
      />
    </Stack>
  );
}
