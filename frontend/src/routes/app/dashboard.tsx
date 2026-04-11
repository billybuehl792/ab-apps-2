import { createFileRoute } from "@tanstack/react-router";
import { Container, Stack, Typography } from "@mui/material";
import { CalendarViewMonth, Groups, Home } from "@mui/icons-material";
import ListCard from "@/components/cards/ListCard";
import PageNotFoundCard from "@/components/cards/PageNotFoundCard";
import type { TRouteLoaderData } from "@/store/types/router";

export const Route = createFileRoute("/app/dashboard")({
  loader: (): TRouteLoaderData => ({ crumb: { label: "Home", Icon: Home } }),
  component: RouteComponent,
  notFoundComponent: () => <PageNotFoundCard />,
});

function RouteComponent() {
  return (
    <Container maxWidth="md">
      <Stack spacing={2} my={2}>
        <Typography variant="h5">Welcome to AB Apps</Typography>
        <Stack spacing={1}>
          <ListCard
            startContent={<Groups fontSize="large" color="disabled" />}
            label="Directory"
            description="Contacts and Places"
            link={{ to: "/app/directory" }}
          />
          <ListCard
            startContent={
              <CalendarViewMonth fontSize="large" color="disabled" />
            }
            label="Board"
            description="Jobs and Tasks"
            link={{ to: "/app/board" }}
          />
        </Stack>
      </Stack>
    </Container>
  );
}
