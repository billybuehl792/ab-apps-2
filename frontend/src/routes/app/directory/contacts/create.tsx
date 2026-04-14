import { type ComponentProps } from "react";
import {
  createFileRoute,
  useCanGoBack,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { Stack, Typography } from "@mui/material";
import { ContactIcons } from "@/store/constants/contacts";
import ContactCreateForm from "@/containers/forms/ContactCreateForm";
import type { TRouteLoaderData } from "@/store/types/router";

export const Route = createFileRoute("/app/directory/contacts/create")({
  loader: (): TRouteLoaderData => ({
    crumb: { label: "Create Contact", Icon: ContactIcons.Create },
  }),
  component: RouteComponent,
});

function RouteComponent() {
  /** Values */

  const navigate = useNavigate();
  const router = useRouter();
  const canGoBack = useCanGoBack();

  /** Callbacks */

  const handleOnSuccess: ComponentProps<
    typeof ContactCreateForm
  >["onSuccess"] = (newContact) =>
    navigate({
      to: "/app/directory/contacts/$id",
      params: { id: String(newContact.id) },
      ignoreBlocker: true,
    });

  const handleOnCancel = () => {
    if (canGoBack) router.history.back();
    else navigate({ to: "/app/directory/contacts" });
  };

  return (
    <Stack spacing={2} my={2}>
      <Typography variant="h5">Create New Contact</Typography>
      <ContactCreateForm
        onSuccess={handleOnSuccess}
        onCancel={handleOnCancel}
      />
    </Stack>
  );
}
