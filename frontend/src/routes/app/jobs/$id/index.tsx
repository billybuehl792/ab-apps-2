import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Container, Stack, Tab, Tabs } from "@mui/material";
import JobMenuOptionIconButton from "@/containers/buttons/JobMenuOptionIconButton";
import JobDetailCard from "@/containers/cards/JobDetailCard";
import { EJobOptionId } from "@/store/enums/jobs";
import { EObjectChangeType } from "@/store/enums/api";

const PageOptionsIconButton: React.FC = () => {
  /** Values */

  const { job } = Route.useRouteContext();
  const navigate = useNavigate();

  return (
    <JobMenuOptionIconButton
      job={job}
      hideOptions={[EJobOptionId.Detail]}
      onChange={(_, type) => {
        if (type === EObjectChangeType.Delete) navigate({ to: "/app/jobs" });
      }}
    />
  );
};

export const Route = createFileRoute("/app/jobs/$id/")({
  beforeLoad: () => ({
    crumb: null,
    pageHeaderEndContent: <PageOptionsIconButton />,
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const [tabValue, setTabValue] = useState(0);

  /** Values */

  const context = Route.useRouteContext();

  return (
    <Container>
      <Stack spacing={1} py={2}>
        <JobDetailCard job={context.job} />
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
