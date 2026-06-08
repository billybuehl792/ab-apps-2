import { useState } from "react";
import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { Container, Stack, Tab, Tabs } from "@mui/material";
import { router } from "@/main";
import JobMenuOptionIconButton from "@/containers/buttons/JobMenuOptionIconButton";
import JobDetailCard from "@/containers/cards/JobDetailCard";
import { EJobOptionId } from "@/store/enums/jobs";
import { EObjectChangeType } from "@/store/enums/api";
import type { TRouteLoaderData } from "@/store/types/router";

export const Route = createFileRoute("/app/jobs/$id/")({
  loader: async ({ parentMatchPromise }): Promise<TRouteLoaderData> => {
    const job = (await parentMatchPromise).loaderData?.data;
    return {
      slotProps: {
        pageHeader: {
          endContent: !!job && (
            <JobMenuOptionIconButton
              job={job}
              hideOptions={[EJobOptionId.Detail]}
              onChange={(_, type) => {
                if (type === EObjectChangeType.Delete)
                  router.navigate({ to: "/app/jobs" });
              }}
            />
          ),
        },
      },
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const [tabValue, setTabValue] = useState(0);

  /** Values */

  const loaderData = useLoaderData({ from: "/app/jobs/$id" });

  const job = loaderData.data;

  return (
    <Container maxWidth="md">
      <Stack spacing={1} py={2}>
        <JobDetailCard job={job} />
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
    </Container>
  );
}
