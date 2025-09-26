import { createFileRoute, Outlet, useMatches } from "@tanstack/react-router";
import { Box, Breadcrumbs, Container } from "@mui/material";
import { ArrowBack, Home } from "@mui/icons-material";
import PageHeader from "@/components/layout/PageHeader";
import CustomLink from "@/components/links/CustomLink";
import StatusCard from "@/components/cards/StatusCard";

export const Route = createFileRoute("/app/dashboard")({
  loader: () => {
    const crumb: Crumb = { label: "Home", Icon: Home };
    return { crumb };
  },
  component: RouteComponent,
  notFoundComponent: () => (
    <StatusCard
      error="Page not found :("
      description={<CustomLink label="Back" Icon={ArrowBack} to=".." />}
    />
  ),
});

function RouteComponent() {
  /** Values */

  const matches = useMatches();

  return (
    <Container maxWidth="lg">
      <PageHeader
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Breadcrumbs>
          {matches.map(
            (match) =>
              !!match.loaderData?.crumb && (
                <CustomLink
                  key={match.id}
                  label={match.loaderData.crumb.label}
                  Icon={match.loaderData.crumb.Icon}
                  to={match.pathname}
                  activeOptions={{ exact: true, includeSearch: false }}
                  color="text.secondary"
                  sx={{
                    "&[data-status='active']": {
                      color: "text.primary",
                      fontWeight: "bold",
                      pointerEvents: "none",
                      cursor: "default",
                    },
                  }}
                />
              )
          )}
        </Breadcrumbs>
      </PageHeader>

      <Box my={2}>
        <Outlet />
      </Box>
    </Container>
  );
}
