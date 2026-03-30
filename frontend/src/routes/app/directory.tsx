import { createFileRoute, Outlet, useMatches } from "@tanstack/react-router";
import { Container } from "@mui/material";
import { Groups } from "@mui/icons-material";
import PageHeader from "@/components/layout/PageHeader";
import NavBreadcrumbs from "@/containers/layout/NavBreadcrumbs";
import type { TRouteLoaderData } from "@/store/types/router";

export const Route = createFileRoute("/app/directory")({
  loader: (): TRouteLoaderData => ({
    crumb: { label: "Directory", Icon: Groups },
  }),
  component: RouteComponent,
});

function RouteComponent() {
  /** Values */

  const matches = useMatches();
  const currentMatch = matches.at(-1);

  return (
    <Container maxWidth="md">
      <PageHeader
        title={<NavBreadcrumbs />}
        {...currentMatch?.loaderData?.slotProps?.pageHeader}
      />
      <Outlet />
    </Container>
  );
}
