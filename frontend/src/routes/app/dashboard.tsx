import { createFileRoute } from "@tanstack/react-router";
import { Container, Stack, Typography } from "@mui/material";
import { Groups, Home } from "@mui/icons-material";
import StatusWrapper from "@/components/layout/StatusWrapper";
import CustomLink from "@/components/links/CustomLink";
import type { TRouteLoaderData } from "@/store/types/router";
import ListCard from "@/components/cards/ListCard";

export const Route = createFileRoute("/app/dashboard")({
  loader: (): TRouteLoaderData => ({ crumb: { label: "Home", Icon: Home } }),
  component: RouteComponent,
  notFoundComponent: () => (
    <StatusWrapper
      error={{
        label: "Page not found :(",
        actions: [
          <CustomLink label="Home" icon={<Home />} to="/app/dashboard" />,
        ],
      }}
    />
  ),
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
        </Stack>
      </Stack>
    </Container>
  );
}
