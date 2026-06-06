import { useState } from "react";
import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { Container, Stack, Tab, Tabs } from "@mui/material";
import { router } from "@/main";
import ContactMenuOptionIconButton from "@/containers/buttons/ContactMenuOptionIconButton";
import ContactDetailCard from "@/containers/cards/ContactDetailCard";
import { idSchema } from "@/store/schemas/basic";
import { EContactOptionId } from "@/store/enums/contacts";
import { EObjectChangeType } from "@/store/enums/api";
import type { TRouteLoaderData } from "@/store/types/router";

export const Route = createFileRoute("/app/contacts/$id/")({
  loader: ({ params }): TRouteLoaderData => ({
    slotProps: {
      pageHeader: {
        endContent: (
          <ContactMenuOptionIconButton
            contact={idSchema.parse(params.id)}
            hideOptions={[EContactOptionId.Detail]}
            onChange={(_, type) => {
              if (type === EObjectChangeType.Delete)
                router.navigate({ to: "/app/contacts" });
            }}
          />
        ),
      },
    },
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const [tabValue, setTabValue] = useState(0);

  /** Values */

  const loaderData = useLoaderData({ from: "/app/contacts/$id" });

  const contact = loaderData.data;

  return (
    <Stack component={Container} spacing={1} py={2}>
      <ContactDetailCard contact={contact} />
      <Stack spacing={2}>
        <Tabs
          value={tabValue}
          variant="scrollable"
          scrollButtons={false}
          onChange={(_, newValue) => setTabValue(newValue)}
        >
          <Tab label="Documents" />
          <Tab label="History" />
        </Tabs>
      </Stack>
    </Stack>
  );
}
