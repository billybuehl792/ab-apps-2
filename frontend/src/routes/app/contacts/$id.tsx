import { createFileRoute, notFound } from "@tanstack/react-router";
import { Container } from "@mui/material";
import { ContactIcons } from "@/store/constants/contacts";
import contactEndpoints from "@/store/endpoints/contacts";
import { errorUtils } from "@/store/utils/error";
import PageNotFoundCard from "@/components/cards/PageNotFoundCard";

export const Route = createFileRoute("/app/contacts/$id")({
  beforeLoad: async ({ context, params }) => {
    try {
      const contact = await context.queryClient.fetchQuery({
        queryKey: contactEndpoints.contact(params.id).id,
        queryFn: contactEndpoints.contact(params.id).get,
      });

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
      <PageNotFoundCard my={2} />
    </Container>
  ),
});
