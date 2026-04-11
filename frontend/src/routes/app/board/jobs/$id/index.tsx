import { useState } from "react";
import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { Stack, Tab, Tabs } from "@mui/material";
import { router } from "@/main";
import JobMenuOptionIconButton from "@/containers/buttons/JobMenuOptionIconButton";
import JobDetailCard from "@/containers/cards/JobDetailCard";
import { idSchema } from "@/store/schemas/basic";
import { EJobOptionId } from "@/store/enums/jobs";
import { EObjectChangeType } from "@/store/enums/api";
import type { TRouteLoaderData } from "@/store/types/router";

export const Route = createFileRoute("/app/board/jobs/$id/")({
  loader: ({ params }): TRouteLoaderData => ({
    slotProps: {
      pageHeader: {
        endContent: (
          <JobMenuOptionIconButton
            job={idSchema.parse(params.id)}
            hideOptions={[EJobOptionId.Detail]}
            onChange={(_, type) => {
              if (type === EObjectChangeType.Delete)
                router.navigate({ to: "/app/board/jobs" });
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

  const loaderData = useLoaderData({ from: "/app/board/jobs/$id" });

  const job = loaderData.data;

  return (
    <Stack spacing={1} my={2}>
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
  );
}
