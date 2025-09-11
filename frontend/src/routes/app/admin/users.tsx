import {
  createFileRoute,
  LinkOptions,
  useMatches,
  Outlet,
} from "@tanstack/react-router";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@/components/elements/Link";
import PageHeader from "@/components/layout/PageHeader";
import UserMenuOptionIconButton from "@/containers/buttons/UserMenuOptionIconButton";

export const Route = createFileRoute("/app/admin/users")({
  component: RouteComponent,
});

function RouteComponent() {
  /** Values */

  const matches = useMatches();
  const rootMatch = matches.some((m) => m.routeId === "/app/admin/users/");
  const detailMatch = matches.find((m) => m.routeId === "/app/admin/users/$id");

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
      >
        <Breadcrumbs>
          {crumbs.map((crumb) => (
            <Link id={crumb.id} label={crumb.label} {...crumb.link} />
          ))}
        </Breadcrumbs>
        {!!rootMatch && <Link to="/app/admin/users/create" label="Create" />}
        {!!detailMatch && (
          <UserMenuOptionIconButton user={Number(detailMatch.params.id)} />
        )}
      </PageHeader>
      <Outlet />
    </>
  );
}
