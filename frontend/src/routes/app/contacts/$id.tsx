import { createFileRoute, notFound } from "@tanstack/react-router";
import { Container } from "@mui/material";
import { ContactIcons } from "@/store/constants/contacts";
import { contactQueries } from "@/store/queries/contacts";
import { errorUtils } from "@/store/utils/error";
import PageNotFoundCard from "@/components/cards/PageNotFoundCard";

export const Route = createFileRoute("/app/contacts/$id")({
  beforeLoad: async ({ context, params }) => {
    try {
      const id = Number(params.id);
      if (isNaN(id)) throw new Error("Invalid contact ID");

      const contact = await context.queryClient.fetchQuery(
        contactQueries.contact(id).detail,
      );

      return {
        contact,
        crumb: {
          label: `${contact.first_name} ${contact.last_name}`,
          Icon: ContactIcons.Detail,
        },
      };
    } catch (error) {
      throw notFound({ data: errorUtils.getErrorMessage(error) });
    }
  },
  notFoundComponent: () => (
    <Container>
      <PageNotFoundCard
        label="Contact not found"
        description="The contact you are looking for does not exist or has been removed."
        my={2}
      />
    </Container>
  ),
});
