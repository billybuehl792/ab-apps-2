import {
  createFileRoute,
  type LinkOptions,
  Outlet,
  useMatches,
} from "@tanstack/react-router";
import { Box, Breadcrumbs, Container } from "@mui/material";
import StatusCard from "@/components/cards/StatusCard";
import PageHeader from "@/components/layout/PageHeader";
import Link from "@/components/elements/Link";
import { UserGroup } from "@/store/enums/account";

export const Route = createFileRoute("/app/admin")({
  beforeLoad: ({ context }) => {
    if (
      !context.auth.me?.groups.some((group) =>
        [UserGroup.AbAdmin, UserGroup.CompanyAdmin].includes(group)
      )
    )
      throw new Error("Insufficient permissions to access this content.");
  },
  loader: () => ({ crumb: "Admin" }),
  component: RouteComponent,
  errorComponent: ({ error }) => <StatusCard error={error} />,
  notFoundComponent: () => <StatusCard error="Page not found" />,
});

function RouteComponent() {
  /** Values */

  const matches = useMatches();

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
      </PageHeader>
      <Box py={2}>
        <Outlet />
      </Box>
    </Container>
  );
}
