import { createFileRoute, Outlet, useMatches } from "@tanstack/react-router";
import { Container } from "@mui/material";
import { Home } from "@mui/icons-material";
import PageHeader from "@/components/layout/PageHeader";
import StatusWrapper from "@/components/layout/StatusWrapper";
import CustomLink from "@/components/links/CustomLink";
import NavBreadcrumbs from "@/containers/layout/NavBreadcrumbs";
import type { TRouteLoaderData } from "@/store/types/router";

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
  /** Values */

  const matches = useMatches();
  const currentMatch = matches[matches.length - 1];

  return (
    <Container maxWidth="md">
      <PageHeader
        title={<NavBreadcrumbs />}
        {...currentMatch.loaderData?.slotProps?.pageHeader}
      />
      <Outlet />
    </Container>
  );
}
