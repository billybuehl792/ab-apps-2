import {
  createFileRoute,
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

  const isRoot = matches.some((m) => m.routeId === "/app/clients/");
  const clientId = matches.find((m) => m.routeId === "/app/clients/$id")?.params
    .id;

  const crumbs: MenuOption[] = [
    { id: "clients", label: "Clients", link: { to: "/app/clients" } },
    ...matches
      .filter((m) => !!m.loaderData?.crumb)
      .map((m) => ({
        id: m.id,
        label: m.loaderData?.crumb ?? "",
        link: { to: m.pathname } as MenuOption["link"],
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
        {isRoot && <Link to="/app/clients/create" label="Create" />}
        {!!clientId && <ClientMenuOptionIconButton client={clientId} />}
      </Stack>
      <Outlet />
    </Stack>
  );
}
