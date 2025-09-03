import {
  createFileRoute,
  type LinkOptions,
  Outlet,
  useMatches,
} from "@tanstack/react-router";
import { Breadcrumbs } from "@mui/material";
import Link from "@/components/elements/Link";
import ClientMenuOptionIconButton from "@/containers/buttons/ClientMenuOptionIconButton";
import PageHeader from "@/components/layout/PageHeader";
import { DEFAULT_PAGE_HEADER_HEIGHT } from "@/store/constants/layout";

export const Route = createFileRoute("/app/clients")({
  loader: () => ({ crumb: "Clients" }),
  component: RouteComponent,
});

function RouteComponent() {
  /** Values */

  const matches = useMatches();

  const rootMatch = matches.find((m) => m.routeId === "/app/clients/");
  const detailMatch = matches.find((m) => m.routeId === "/app/clients/$id");

  const crumbs = matches
    .filter((m) => !!m.loaderData?.crumb)
    .map((m) => ({
      id: m.id,
      label: m.loaderData?.crumb ?? "",
      link: { to: m.pathname } as LinkOptions,
    }));

  return (
    <>
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
        {!!rootMatch && <Link to="/app/clients/create" label="Create" />}
        {!!detailMatch && (
          <ClientMenuOptionIconButton client={Number(detailMatch.params.id)} />
        )}
      </PageHeader>
      <Outlet />
    </>
  );
}
