import {
  createFileRoute,
  Outlet,
  useChildMatches,
} from "@tanstack/react-router";
import { Breadcrumbs, Stack } from "@mui/material";
import Link from "@/components/elements/Link";

export const Route = createFileRoute("/app/clients")({
  loader: () => ({ crumb: "Clients" }),
  component: RouteComponent,
});

function RouteComponent() {
  /** Values */

  const matches = useChildMatches();

  const crumbs: MenuOption[] = [
    { id: "clients", label: "Clients", link: { to: "/app/clients" } },
    ...matches
      .filter((match) => !!match.loaderData?.crumb)
      .map((match) => ({
        id: match.id,
        label: match.loaderData?.crumb ?? "",
        link: { to: match.pathname } as MenuOption["link"],
      })),
  ];

  return (
    <Stack spacing={1}>
      <Breadcrumbs>
        {crumbs.map((crumb) => (
          <Link id={crumb.id} label={crumb.label} {...crumb.link} />
        ))}
      </Breadcrumbs>
      <Outlet />
    </Stack>
  );
}
