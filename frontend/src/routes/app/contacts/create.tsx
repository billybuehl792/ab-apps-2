import {
  createFileRoute,
  useCanGoBack,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { Container, Stack, Typography } from "@mui/material";
import { contactEndpoints, ContactIcons } from "@/store/constants/contacts";
import ContactCreateForm, {
  type IContactCreateFormProps,
} from "@/containers/forms/ContactCreateForm";
import { useMutation } from "@tanstack/react-query";
import { EObjectChangeType } from "@/store/enums/api";
import { useSnackbar } from "notistack";
import { markdownUtils } from "@/store/utils/markdown";
import { errorUtils } from "@/store/utils/error";
import type { TRouteLoaderData } from "@/store/types/router";

export const Route = createFileRoute("/app/contacts/create")({
  loader: (): TRouteLoaderData => ({
    crumb: { label: "Create", Icon: ContactIcons.Create },
  }),
  component: RouteComponent,
});

function RouteComponent() {
  /** Values */

  const navigate = useNavigate();
  const router = useRouter();
  const snackbar = useSnackbar();
  const canGoBack = useCanGoBack();

  /** Mutations */

  const createContactMutation = useMutation({
    mutationKey: [contactEndpoints.id, EObjectChangeType.Create],
    mutationFn: contactEndpoints.post,
    onSuccess: (res) =>
      snackbar.enqueueSnackbar(
        `${markdownUtils.bold(`${res.first_name} ${res.last_name}`)} created successfully`,
        { variant: "success" },
      ),
    onError: (error) =>
      snackbar.enqueueSnackbar(errorUtils.getErrorMessage(error), {
        variant: "error",
      }),
  });

  /** Callbacks */

  const handleOnSubmit: IContactCreateFormProps["onSubmit"] = (data) =>
    createContactMutation.mutateAsync(
      {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone_primary: data.phonePrimary,
        phone_secondary: data.phoneSecondary,
        google_place_id: data.place?.placePrediction.placeId,
      },
      {
        onSuccess: (newContact) =>
          navigate({
            to: "/app/contacts/$id",
            params: { id: String(newContact.id) },
            ignoreBlocker: true,
          }),
      },
    );

  const handleOnCancel = () => {
    if (canGoBack) router.history.back();
    else navigate({ to: "/app/contacts" });
  };

  return (
    <Container maxWidth="md">
      <Stack spacing={2} py={2}>
        <Typography variant="h5">Create New Contact</Typography>
        <ContactCreateForm
          onSubmit={handleOnSubmit}
          onCancel={handleOnCancel}
        />
      </Stack>
    </Container>
  );
}
