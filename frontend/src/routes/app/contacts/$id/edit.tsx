import {
  createFileRoute,
  useCanGoBack,
  useLoaderData,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { Container, Stack, Typography } from "@mui/material";
import { Edit } from "@mui/icons-material";
import useContact from "@/store/hooks/useContact";
import ContactUpdateForm, {
  type IContactUpdateFormProps,
} from "@/containers/forms/ContactUpdateForm";
import type { TRouteLoaderData } from "@/store/types/router";

export const Route = createFileRoute("/app/contacts/$id/edit")({
  component: RouteComponent,
  loader: (): TRouteLoaderData => ({ crumb: { label: "Edit", Icon: Edit } }),
});

function RouteComponent() {
  /** Values */

  const loaderData = useLoaderData({ from: "/app/contacts/$id" });
  const navigate = useNavigate();
  const canGoBack = useCanGoBack();
  const router = useRouter();

  const contactHook = useContact(loaderData.data);
  const contact = contactHook.contact;

  /** Callbacks */

  const handleOnSubmit: IContactUpdateFormProps["onSubmit"] = (data) =>
    contactHook.mutations.update.mutateAsync(
      {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone_primary: data.phonePrimary,
        phone_secondary: data.phoneSecondary,
        google_place_id: data.place?.placePrediction.placeId,
      },
      {
        onSuccess: (newContact) => {
          router.invalidate();
          navigate({
            to: "/app/contacts/$id",
            params: { id: String(newContact.id) },
            ignoreBlocker: true,
          });
        },
      },
    );

  const handleOnCancel = () => {
    if (canGoBack) router.history.back();
    else navigate({ to: "/app/contacts" });
  };

  return (
    <Container maxWidth="md">
      <Stack spacing={2} py={2}>
        <Typography variant="h5">Edit Contact</Typography>
        <ContactUpdateForm
          values={{
            firstName: contact.first_name,
            lastName: contact.last_name,
            email: contact.email,
            phonePrimary: contact.phone_primary,
            phoneSecondary: contact.phone_secondary ?? null,
            place: contact.place
              ? {
                  placePrediction: {
                    placeId: contact.place.google_place_id,
                    text: {
                      text: contact.place.address_short,
                    },
                  },
                }
              : null,
          }}
          onSubmit={handleOnSubmit}
          onCancel={handleOnCancel}
        />
      </Stack>
    </Container>
  );
}
