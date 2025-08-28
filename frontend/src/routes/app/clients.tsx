import {
  createFileRoute,
  type LinkOptions,
  Outlet,
  useChildMatches,
} from "@tanstack/react-router";
import { Breadcrumbs, Stack } from "@mui/material";
import Link from "@/components/elements/Link";
import ClientMenuOptionIconButton from "@/containers/buttons/ClientMenuOptionIconButton";

export const Route = createFileRoute("/app/clients")({
  loader: () => ({ crumb: "Clients" }),
  component: RouteComponent,
});

function RouteComponent() {
  /** Values */

  const matches = useChildMatches();

  const rootMatch = matches.some((m) => m.routeId === "/app/clients/");
  const detailMatch = matches.find((m) => m.routeId === "/app/clients/$id");

  const crumbs = [
    {
      id: "clients",
      label: "Clients",
      link: { to: "/app/clients" } as LinkOptions,
    },
    ...matches
      .filter((m) => !!m.loaderData?.crumb)
      .map((m) => ({
        id: m.id,
        label: m.loaderData?.crumb ?? "",
        link: { to: m.pathname } as LinkOptions,
      })),
  ];

  return (
    <Stack spacing={2}>
      <Stack direction="row" justifyContent="space-between">
        <Breadcrumbs>
          {crumbs.map((crumb) => (
            <Link id={crumb.id} label={crumb.label} {...crumb.link} />
          ))}
        </Breadcrumbs>
        {!!rootMatch && <Link to="/app/clients/create" label="Create" />}
        {!!detailMatch && (
          <ClientMenuOptionIconButton client={detailMatch.params.id} />
        )}
      </Stack>
      <Outlet />
    </Stack>
  );
}
