import { useState } from "react";
import {
  createFileRoute,
  notFound,
  stripSearchParams,
  useNavigate,
} from "@tanstack/react-router";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import z from "zod";
import { useMutation } from "@tanstack/react-query";
import { Stack, Tab, Tabs } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import ClientDetailCard from "@/containers/cards/ClientDetailCard";
import ClientFormDrawer from "@/containers/modals/ClientFormDrawer";
import CustomLink from "@/components/links/CustomLink";
import ClientMenuOptionIconButton from "@/containers/buttons/ClientMenuOptionIconButton";
import { errorUtils } from "@/store/utils/error";
import { clientEndpoints, ClientIcons } from "@/store/constants/clients";
import type { ClientFormValues } from "@/containers/forms/ClientForm";
import type { TRouteLoaderData } from "@/store/types/router";
import type { TClient } from "@/store/types/clients";
import StatusWrapper from "@/components/layout/StatusWrapper";
import { idSchema, truthySchema } from "@/store/schemas/basic";

const paramsSchema = z.object({ edit: truthySchema });
const defaultParams = paramsSchema.parse({});

export const Route = createFileRoute("/app/dashboard/clients/$id")({
  validateSearch: zodValidator(fallback(paramsSchema, defaultParams)),
  search: { middlewares: [stripSearchParams(defaultParams)] },
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
        slotProps: {
          pageHeader: {
            endContent: (
              <ClientMenuOptionIconButton
                client={client}
                // hideOptions={[EClientOptionId.Detail]}
              />
            ),
          },
        },
      };
    } catch (error) {
      throw notFound({ data: errorUtils.getErrorMessage(error) });
    }
  },
  component: RouteComponent,
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

function RouteComponent() {
  const [tabValue, setTabValue] = useState(0);
  // const [workOrderListParams, setWorkOrderListParams] =
  //   useState<WorkOrderListRequestParams>({});

  /** Values */

  const loaderData = Route.useLoaderData();
  const search = Route.useSearch();
  const navigate = useNavigate();

  const client = loaderData.data;
  const isEditing = search.edit;

  /** Mutations */

  const updateClientMutation = useMutation({
    mutationKey: clientEndpoints.client(client.id).id,
    mutationFn: clientEndpoints.client(client.id).patch,
  });

  /** Callbacks */

  const handleUpdateClient = (data: ClientFormValues) =>
    updateClientMutation.mutateAsync({
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone_primary: data.phonePrimary,
      phone_secondary: data.phoneSecondary,
      place: data.place,
    });

  const handleOnClose = () =>
    navigate({
      to: "/app/dashboard/clients/$id",
      params: { id: String(client.id) },
      search: { edit: false },
    });

  return (
    <Stack spacing={1} my={2}>
      <ClientDetailCard client={client} />
      <Stack spacing={2}>
        <Tabs
          value={tabValue}
          variant="scrollable"
          scrollButtons={false}
          onChange={(_, newValue) => setTabValue(newValue)}
        >
          <Tab label="Work Orders" />
          <Tab label="Documents" />
          <Tab label="History" />
        </Tabs>
        {/* {tabValue === 0 && (
          <WorkOrderList
            params={workOrderListParams}
            baseParams={{ client: [client.id] }}
            onParamsChange={setWorkOrderListParams}
          />
        )} */}
      </Stack>

      {/* Modals */}
      <ClientFormDrawer
        open={isEditing}
        title={client.full_name}
        form={{
          values: {
            firstName: client.first_name,
            lastName: client.last_name,
            email: client.email,
            phonePrimary: client.phone_primary,
            phoneSecondary: client.phone_secondary,
            place: client.place,
          },
          onSubmit: handleUpdateClient,
          onSuccess: handleOnClose,
        }}
        onClose={handleOnClose}
      />
    </Stack>
  );
}
