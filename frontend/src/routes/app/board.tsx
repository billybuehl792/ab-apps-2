import { createFileRoute, useMatches, Outlet } from "@tanstack/react-router";
import { Container } from "@mui/material";
import { CalendarViewMonth } from "@mui/icons-material";
import PageNotFoundCard from "@/components/cards/PageNotFoundCard";
import StatusWrapper from "@/components/layout/StatusWrapper";
import NavBreadcrumbs from "@/containers/layout/NavBreadcrumbs";
import PageHeader from "@/components/layout/PageHeader";
import type { TRouteLoaderData } from "@/store/types/router";

export const Route = createFileRoute("/app/board")({
  loader: (): TRouteLoaderData => {
    return { crumb: { label: "Board", Icon: CalendarViewMonth } };
  },
  component: RouteComponent,
  pendingComponent: () => <StatusWrapper loading m={2} />,
  errorComponent: ({ error }) => <StatusWrapper error={error} m={2} />,
  notFoundComponent: () => <PageNotFoundCard m={2} />,
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
