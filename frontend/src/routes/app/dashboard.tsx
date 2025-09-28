import { createFileRoute, Outlet, useMatches } from "@tanstack/react-router";
import { Box, Container } from "@mui/material";
import { ArrowBack, Home } from "@mui/icons-material";
import PageHeader from "@/components/layout/PageHeader";
import CustomLink from "@/components/links/CustomLink";
import StatusCard from "@/components/cards/StatusCard";
import NavBreadcrumbs from "@/containers/layout/NavBreadcrumbs";

export const Route = createFileRoute("/app/dashboard")({
  loader: () => {
    const crumb: Crumb = { label: "Home", Icon: Home };
    return { crumb };
  },
  component: RouteComponent,
  notFoundComponent: () => (
    <StatusCard
      error="Page not found :("
      description={<CustomLink label="Back" Icon={ArrowBack} to=".." />}
    />
  ),
});

function RouteComponent() {
  /** Values */

  const matches = useMatches();
  const currentMatch = matches[matches.length - 1];

  return (
    <Container maxWidth="md">
      <PageHeader
        title={<NavBreadcrumbs />}
        {...currentMatch.context?.slotProps?.pageHeader}
      />
      <Box my={2}>
        <Outlet />
      </Box>
    </Container>
  );
}
