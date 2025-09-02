import {
  createFileRoute,
  type LinkOptions,
  Outlet,
  useMatches,
} from "@tanstack/react-router";
import { Box, Breadcrumbs, Stack } from "@mui/material";
import Link from "@/components/elements/Link";
import PageHeader from "@/components/layout/PageHeader";
import WorkOrderMenuOptionIconButton from "@/containers/buttons/WorkOrderMenuOptionIconButton";
import { DEFAULT_PAGE_HEADER_HEIGHT } from "@/store/constants/layout";

export const Route = createFileRoute("/app/work-orders")({
  loader: () => ({ crumb: "Work Orders" }),
  component: RouteComponent,
});

function RouteComponent() {
  /** Values */

  const matches = useMatches();

  const rootMatch = matches.some((m) => m.routeId === "/app/work-orders/");
  const detailMatch = matches.find((m) => m.routeId === "/app/work-orders/$id");

  const crumbs = matches
    .filter((m) => !!m.loaderData?.crumb)
    .map((m) => ({
      id: m.id,
      label: m.loaderData?.crumb ?? "",
      link: { to: m.pathname } as LinkOptions,
    }));

  return (
    <Stack>
      <PageHeader
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        height={DEFAULT_PAGE_HEADER_HEIGHT}
      >
        <Breadcrumbs>
          {crumbs.map((crumb) => (
            <Link id={crumb.id} label={crumb.label} {...crumb.link} />
          ))}
        </Breadcrumbs>
        {!!rootMatch && <Link to="/app/work-orders/create" label="Create" />}
        {!!detailMatch && (
          <WorkOrderMenuOptionIconButton workOrder={detailMatch.params.id} />
        )}
      </PageHeader>
      <Box p={2}>
        <Outlet />
      </Box>
    </Stack>
  );
}
