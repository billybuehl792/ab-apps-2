import { createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowBack } from "@mui/icons-material";
import { contactEndpoints, ContactIcons } from "@/store/constants/contacts";
import ButtonLink from "@/components/links/ButtonLink";
import StatusWrapper from "@/components/layout/StatusWrapper";
import { idSchema } from "@/store/schemas/basic";
import { errorUtils } from "@/store/utils/error";
import type { TContact } from "@/store/types/contacts";
import type { TRouteLoaderData } from "@/store/types/router";

export const Route = createFileRoute("/app/dashboard/contacts/$id")({
  loader: async ({ context, params }): Promise<TRouteLoaderData<TContact>> => {
    try {
      const contactId = idSchema.parse(params.id);
      const contact = await context.queryClient.fetchQuery({
        queryKey: contactEndpoints.contact(contactId).id,
        queryFn: contactEndpoints.contact(contactId).get,
      });

      return {
        data: contact,
        crumb: {
          label: `${contact.first_name} ${contact.last_name}`,
          Icon: ContactIcons.Detail,
        },
      };
    } catch (error) {
      throw notFound({ data: errorUtils.getErrorMessage(error) });
    }
  },
  pendingComponent: () => <StatusWrapper loading="loading contact..." my={2} />,
  notFoundComponent: () => (
    <StatusWrapper
      error={{
        label: "Contact not found :(",
        actions: [
          <ButtonLink children="Back" startIcon={<ArrowBack />} to=".." />,
        ],
      }}
      my={2}
    />
  ),
});
