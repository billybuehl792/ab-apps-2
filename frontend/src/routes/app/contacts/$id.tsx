import { createFileRoute, notFound } from "@tanstack/react-router";
import { contactEndpoints, ContactIcons } from "@/store/constants/contacts";
import { errorUtils } from "@/store/utils/error";
import { idSchema } from "@/store/schemas/basic";
import type { TRouteLoaderData } from "@/store/types/router";
import type { TContact } from "@/store/types/contacts";

export const Route = createFileRoute("/app/contacts/$id")({
  loader: async ({ context, params }): Promise<TRouteLoaderData<TContact>> => {
    try {
      const contactId = idSchema.parse(params.id);
      const contact = await context.queryClient.fetchQuery({
        queryKey: contactEndpoints.contact(contactId).id,
        queryFn: contactEndpoints.contact(contactId).get,
      });
      const contactFullName = `${contact.first_name} ${contact.last_name}`;

      return {
        data: contact,
        crumb: { label: contactFullName, Icon: ContactIcons.Detail },
      };
    } catch (error) {
      throw notFound({ data: errorUtils.getErrorMessage(error) });
    }
  },
});
