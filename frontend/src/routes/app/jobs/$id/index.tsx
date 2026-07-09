import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { Container, Stack } from "@mui/material";

export const Route = createFileRoute("/app/jobs/$id/")({
  component: RouteComponent,
});

function RouteComponent() {
  /** Values */

  const loaderData = useLoaderData({ from: "/app/jobs/$id" });
  const job = loaderData.job;

  return (
    <Container>
      <Stack>{`Job ${job.id}`}</Stack>
    </Container>
  );
}
