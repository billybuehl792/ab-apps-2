import { type ComponentProps } from "react";
import {
  createFileRoute,
  useCanGoBack,
  useLoaderData,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { Stack, Typography } from "@mui/material";
import { Edit } from "@mui/icons-material";
import useContact from "@/store/hooks/useContact";
import ContactUpdateForm from "@/containers/forms/ContactUpdateForm";
import type { TRouteLoaderData } from "@/store/types/router";

export const Route = createFileRoute("/app/directory/contacts/$id/edit")({
  component: RouteComponent,
  loader: ({ params }): TRouteLoaderData<{ id: number }> => ({
    data: { id: Number(params.id) },
    crumb: { label: "Edit", Icon: Edit },
  }),
});

function RouteComponent() {
  /** Values */

  const loaderData = useLoaderData({ from: "/app/directory/contacts/$id" });
  const navigate = useNavigate();
  const canGoBack = useCanGoBack();
  const router = useRouter();

  const contactHook = useContact(loaderData.data);
  const contact = contactHook.contact;

  /** Callbacks */

  const handleOnSuccess: ComponentProps<
    typeof ContactUpdateForm
  >["onSuccess"] = (updatedContact) => {
    router.invalidate();
    navigate({
      to: "/app/directory/contacts/$id",
      params: { id: String(updatedContact.id) },
      ignoreBlocker: true,
    });
  };

  const handleOnCancel = () => {
    if (canGoBack) router.history.back();
    else navigate({ to: "/app/directory/contacts" });
  };

  return (
    <Stack spacing={2} my={2}>
      <Stack>
        <Typography variant="h5">Edit Contact</Typography>
        <Typography variant="caption">
          {contact.first_name} {contact.last_name}
        </Typography>
      </Stack>
      <ContactUpdateForm
        contact={contact}
        onSuccess={handleOnSuccess}
        onCancel={handleOnCancel}
      />
    </Stack>
  );
}
