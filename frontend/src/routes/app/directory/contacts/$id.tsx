import { createFileRoute, notFound } from "@tanstack/react-router";
import { contactEndpoints, ContactIcons } from "@/store/constants/contacts";
import StatusWrapper from "@/components/layout/StatusWrapper";
import PageNotFoundCard from "@/components/cards/PageNotFoundCard";
import { idSchema } from "@/store/schemas/basic";
import { errorUtils } from "@/store/utils/error";
import type { TContact } from "@/store/types/contacts";
import type { TRouteLoaderData } from "@/store/types/router";

export const Route = createFileRoute("/app/directory/contacts/$id")({
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
  pendingComponent: () => <StatusWrapper loading="Loading Contact..." my={2} />,
  errorComponent: ({ error }) => <StatusWrapper error={error} my={2} />,
  notFoundComponent: () => <PageNotFoundCard my={2} />,
});
