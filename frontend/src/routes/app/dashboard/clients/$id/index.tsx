import { useState } from "react";
import {
  createFileRoute,
  useLoaderData,
  useNavigate,
} from "@tanstack/react-router";
import { Stack, Tab, Tabs } from "@mui/material";
import ClientDetailCard from "@/containers/cards/ClientDetailCard";
import ClientMenuOptionIconButton from "@/containers/buttons/ClientMenuOptionIconButton";
import { router } from "@/main";
import useClient from "@/store/hooks/useClient";
import { idSchema } from "@/store/schemas/basic";
import { EClientOptionId } from "@/store/enums/clients";
import { EObjectChangeType } from "@/store/enums/api";
import type { TRouteLoaderData } from "@/store/types/router";

export const Route = createFileRoute("/app/dashboard/clients/$id/")({
  component: RouteComponent,
  loader: ({ params }): TRouteLoaderData => ({
    slotProps: {
      pageHeader: {
        endContent: (
          <ClientMenuOptionIconButton
            client={{ id: idSchema.parse(params.id) }}
            hideOptions={[EClientOptionId.Detail]}
            onChange={(_, type) => {
              if (type === EObjectChangeType.Delete)
                router.navigate({ to: "/app/dashboard/clients" });
            }}
          />
        ),
      },
    },
  }),
});

function RouteComponent() {
  const [tabValue, setTabValue] = useState(0);
  // const [workOrderListParams, setWorkOrderListParams] =
  //   useState<WorkOrderListRequestParams>({});

  /** Values */

  const loaderData = useLoaderData({ from: "/app/dashboard/clients/$id" });
  const search = Route.useSearch();

  const clientHook = useClient(loaderData.data);
  const navigate = useNavigate();

  const client = loaderData.data;

  /** Callbacks */

  // const handleUpdateClient = (data: ClientFormValues) =>
  //   updateClientMutation.mutateAsync({
  //     first_name: data.firstName,
  //     last_name: data.lastName,
  //     email: data.email,
  //     phone_primary: data.phonePrimary,
  //     phone_secondary: data.phoneSecondary,
  //     place: data.place,
  //   });

  // const handleOnClose = () =>
  //   navigate({
  //     to: "/app/dashboard/clients/$id",
  //     params: { id: String(client.id) },
  //     search: { edit: false },
  //   });

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
      {/* <ClientFormDrawer
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
      /> */}
    </Stack>
  );
}
