import {
  createFileRoute,
  notFound,
  useCanGoBack,
  useRouter,
} from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Container, Skeleton, Stack, Typography } from "@mui/material";
import useContact from "@/store/hooks/useContact";
import Breadcrumb from "@/components/links/Breadcrumb";
import PageNotFoundCard from "@/components/cards/PageNotFoundCard";
import ContactUpdateForm, {
  type IContactUpdateFormProps,
} from "@/containers/forms/ContactUpdateForm";
import ContactMenuOptionIconButton from "@/containers/buttons/ContactMenuOptionIconButton";
import { contactQueries } from "@/store/queries/contacts";
import { ContactIcons } from "@/store/constants/contacts";
import { errorUtils } from "@/store/utils/error";
import { idSchema } from "@/store/schemas/basic";
import { EContactOptionId } from "@/store/enums/contacts";
import { EObjectChangeType } from "@/store/enums/api";

const Crumb: React.FC = () => {
  /** Values */

  const params = Route.useParams();

  /** Queries */

  const contactQuery = useQuery(contactQueries.contact(params.id).detail);

  if (contactQuery.isPending) return <Skeleton variant="text" width={100} />;
  if (contactQuery.isError || !contactQuery.data) return <span>-</span>;
  return (
    <Breadcrumb
      to="/app/contacts/edit/$id"
      params={params}
      startIcon={<ContactIcons.Edit />}
      children={`Edit ${contactQuery.data.first_name} ${contactQuery.data.last_name}`}
    />
  );
};

const PageHeaderEndContentComponent: React.FC = () => {
  /** Values */

  const params = Route.useParams();

  /** Queries */

  const contactQuery = useQuery(contactQueries.contact(params.id).detail);
  const router = useRouter();
  const navigate = Route.useNavigate();

  if (!contactQuery.data) return null;
  return (
    <ContactMenuOptionIconButton
      contact={contactQuery.data}
      hideOptions={[EContactOptionId.Edit]}
      onChange={(_, type) => {
        if (type === EObjectChangeType.Delete) {
          router.invalidate();
          navigate({ to: "/app/contacts", replace: true });
        }
      }}
    />
  );
};

export const Route = createFileRoute("/app/contacts/edit/$id")({
  params: {
    parse: ({ id }) => {
      const parsed = idSchema.safeParse(id);
      return parsed.success ? { id: parsed.data } : false;
    },
  },
  loader: async ({ context, params }) => {
    try {
      const contact = await context.queryClient.fetchQuery(
        contactQueries.contact(params.id).detail,
      );
      return { contact };
    } catch (error) {
      throw notFound({ data: errorUtils.getErrorMessage(error) });
    }
  },
  component: RouteComponent,
  notFoundComponent: () => (
    <Container>
      <PageNotFoundCard
        label="Contact not found"
        description="The contact you are looking for does not exist or has been removed."
        my={2}
      />
    </Container>
  ),
  staticData: {
    crumb: { id: "contacts/edit", Component: Crumb },
    PageHeaderEndContentComponent,
  },
});

function RouteComponent() {
  /** Values */

  const loaderData = Route.useLoaderData();
  const navigate = Route.useNavigate();
  const canGoBack = useCanGoBack();
  const router = useRouter();

  const contactHook = useContact(loaderData.contact);
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
            params: { id: newContact.id },
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
    <Container>
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
