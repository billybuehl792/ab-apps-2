import {
  createFileRoute,
  type LinkOptions,
  Outlet,
  useMatches,
} from "@tanstack/react-router";
import { Box, Breadcrumbs, Stack } from "@mui/material";
import Link from "@/components/elements/Link";
import ClientMenuOptionIconButton from "@/containers/buttons/ClientMenuOptionIconButton";
import PageHeader from "@/components/layout/PageHeader";

export const Route = createFileRoute("/app/clients")({
  loader: () => ({ crumb: "Clients" }),
  component: RouteComponent,
});

function RouteComponent() {
  /** Values */

  const matches = useMatches();

  const rootMatch = matches.some((m) => m.routeId === "/app/clients/");
  const detailMatch = matches.find((m) => m.routeId === "/app/clients/$id");

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
      >
        <Breadcrumbs>
          {crumbs.map((crumb) => (
            <Link id={crumb.id} label={crumb.label} {...crumb.link} />
          ))}
        </Breadcrumbs>
        {!!rootMatch && <Link to="/app/clients/create" label="Create" />}
        {!!detailMatch && (
          <ClientMenuOptionIconButton client={detailMatch.params.id} />
        )}
      </PageHeader>
      <Box p={2}>
        <Outlet />
      </Box>
    </Stack>
  );
}
