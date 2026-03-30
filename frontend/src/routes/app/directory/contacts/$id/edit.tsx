import { useState, type ComponentProps } from "react";
import {
  createFileRoute,
  useBlocker,
  useLoaderData,
  useNavigate,
} from "@tanstack/react-router";
import { Stack, Typography } from "@mui/material";
import { Edit } from "@mui/icons-material";
import useContact from "@/store/hooks/useContact";
import useConfirm from "@/store/hooks/useConfirm";
import ContactUpdateForm from "@/containers/forms/ContactUpdateForm";
import type { TRouteLoaderData } from "@/store/types/router";

export const Route = createFileRoute("/app/directory/contacts/$id/edit")({
  component: RouteComponent,
  loader: (): TRouteLoaderData => ({ crumb: { label: "Edit", Icon: Edit } }),
});

function RouteComponent() {
  const [blockNavigation, setBlockNavigation] = useState(false);

  /** Values */

  const loaderData = useLoaderData({ from: "/app/directory/contacts/$id" });
  const navigate = useNavigate();
  const confirm = useConfirm();

  const contactHook = useContact(loaderData.data);

  /** Callbacks */

  const handleOnSubmit: ComponentProps<typeof ContactUpdateForm>["onSubmit"] = (
    data,
  ) =>
    contactHook.mutations.update.mutateAsync(data, {
      onSuccess: (updatedContact) =>
        navigate({
          to: "/app/directory/contacts/$id",
          params: { id: String(updatedContact.id) },
          ignoreBlocker: true,
        }),
    });

  const handleOnCancel: ComponentProps<
    typeof ContactUpdateForm
  >["onCancel"] = () => navigate({ to: ".." });

  const handleOnFormStateChange: ComponentProps<
    typeof ContactUpdateForm
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
        <Typography variant="h5">Edit Contact</Typography>
        <Typography variant="caption">
          {contactHook.contact.first_name} {contactHook.contact.last_name}
        </Typography>
      </Stack>
      <ContactUpdateForm
        contact={contactHook.contact}
        onFormStateChange={handleOnFormStateChange}
        onSubmit={handleOnSubmit}
        onCancel={handleOnCancel}
      />
    </Stack>
  );
}
