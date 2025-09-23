import {
  createFileRoute,
  type LinkOptions,
  Outlet,
  useMatches,
} from "@tanstack/react-router";
import { Box, Breadcrumbs, Container } from "@mui/material";
import Link from "@/components/elements/Link";
import PageHeader from "@/components/layout/PageHeader";
import WorkOrderMenuOptionIconButton from "@/containers/buttons/WorkOrderMenuOptionIconButton";

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
    <Container maxWidth="lg">
      <PageHeader
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Breadcrumbs>
          {crumbs.map((crumb) => (
            <Link id={crumb.id} label={crumb.label} {...crumb.link} />
          ))}
        </Breadcrumbs>
        {!!rootMatch && <Link to="/app/work-orders/create" label="Create" />}
        {!!detailMatch && (
          <WorkOrderMenuOptionIconButton
            workOrder={Number(detailMatch.params.id)}
            renderOptions={(options) =>
              options.filter(({ id }) => id !== "detail")
            }
          />
        )}
      </PageHeader>
      <Box py={2}>
        <Outlet />
      </Box>
    </Container>
  );
}
