import { createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowBack } from "@mui/icons-material";
import StatusWrapper from "@/components/layout/StatusWrapper";
import CustomLink from "@/components/links/CustomLink";
import { clientEndpoints, ClientIcons } from "@/store/constants/clients";
import { errorUtils } from "@/store/utils/error";
import { idSchema } from "@/store/schemas/basic";
import type { TRouteLoaderData } from "@/store/types/router";
import type { TClient } from "@/store/types/clients";

export const Route = createFileRoute("/app/dashboard/clients/$id")({
  loader: async ({ context, params }): Promise<TRouteLoaderData<TClient>> => {
    try {
      const clientId = idSchema.parse(params.id);
      const client = await context.queryClient.fetchQuery({
        queryKey: clientEndpoints.client(clientId).id,
        queryFn: clientEndpoints.client(clientId).get,
      });

      return {
        data: client,
        crumb: { label: client.full_name, Icon: ClientIcons.Detail },
      };
    } catch (error) {
      throw notFound({ data: errorUtils.getErrorMessage(error) });
    }
  },
  pendingComponent: () => <StatusWrapper loading="loading client..." my={2} />,
  notFoundComponent: () => (
    <StatusWrapper
      error={{
        label: "Client not found :(",
        actions: [<CustomLink label="Back" icon={<ArrowBack />} to=".." />],
      }}
      my={2}
    />
  ),
});
