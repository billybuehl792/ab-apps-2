import { type ComponentProps, useState } from "react";
import {
  createFileRoute,
  useBlocker,
  useNavigate,
} from "@tanstack/react-router";
import { Stack, Typography } from "@mui/material";
import { ContactIcons } from "@/store/constants/contacts";
import ContactCreateForm from "@/containers/forms/ContactCreateForm";
import useContact from "@/store/hooks/useContact";
import useConfirm from "@/store/hooks/useConfirm";
import { NULL_ID } from "@/store/constants/api";
import type { TRouteLoaderData } from "@/store/types/router";

export const Route = createFileRoute("/app/directory/contacts/create")({
  loader: (): TRouteLoaderData => ({
    crumb: { label: "Create Contact", Icon: ContactIcons.Create },
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const [blockNavigation, setBlockNavigation] = useState(false);

  /** Values */

  const confirm = useConfirm();
  const navigate = useNavigate();

  const contactHook = useContact(NULL_ID);

  /** Callbacks */

  const handleOnSubmit: ComponentProps<typeof ContactCreateForm>["onSubmit"] = (
    body,
  ) =>
    contactHook.mutations.create.mutateAsync(body, {
      onSuccess: (newContact) =>
        navigate({
          to: "/app/directory/contacts/$id",
          params: { id: String(newContact.id) },
          ignoreBlocker: true,
        }),
    });

  const handleOnFormStateChange: ComponentProps<
    typeof ContactCreateForm
  >["onFormStateChange"] = (formState) => setBlockNavigation(formState.isDirty);

  const handleOnCancel: ComponentProps<
    typeof ContactCreateForm
  >["onCancel"] = () => navigate({ to: ".." });

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
      <Typography variant="h5">Create New Contact</Typography>
      <ContactCreateForm
        onFormStateChange={handleOnFormStateChange}
        onSubmit={handleOnSubmit}
        onCancel={handleOnCancel}
      />
    </Stack>
  );
}
