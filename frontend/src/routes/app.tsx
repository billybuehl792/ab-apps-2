import {
  createFileRoute,
  Outlet,
  redirect,
  useMatches,
} from "@tanstack/react-router";
import { Box, Container, Paper, useMediaQuery } from "@mui/material";
import { Home } from "@mui/icons-material";
import NavBar from "@/containers/layout/NavBar";
import NavList from "@/containers/lists/NavList";
import NavBreadcrumbs from "@/containers/layout/NavBreadcrumbs";
import PageHeader from "@/components/layout/PageHeader";
import type { TRouteLoaderData } from "@/store/types/router";
import Footer from "@/containers/layout/Footer";

export const Route = createFileRoute("/app")({
  beforeLoad: ({ context, location }) => {
    const isAuthenticated = !!context.auth.me;
    if (!isAuthenticated)
      throw redirect({
        to: "/sign-in",
        search: { redirect: location.href },
        replace: true,
      });
  },
  loader: (): TRouteLoaderData => ({ crumb: { label: "Home", Icon: Home } }),
  component: RouteComponent,
});

function RouteComponent() {
  /** Values */

  const isDesktop = useMediaQuery(({ breakpoints }) => breakpoints.up("sm"));

  const matches = useMatches();
  const currentMatch = matches.at(-1);

  return (
    <>
      <NavBar sx={(theme) => ({ height: theme.layout.nav.height })} />
      {isDesktop && (
        <Paper
          component="nav"
          variant="outlined"
          square
          sx={({ layout, zIndex }) => ({
            position: "fixed",
            overflowY: "auto",
            zIndex: zIndex.drawer,
            top: layout.nav.height,
            left: 0,
            bottom: 0,
            width: layout.nav.panelWidth,
          })}
        >
          <NavList />
        </Paper>
      )}
      <Box
        component="main"
        sx={(theme) => ({
          position: "absolute",
          top: theme.layout.nav.height,
          bottom: isDesktop ? 0 : theme.layout.footer.height,
          left: isDesktop ? theme.layout.nav.panelWidth : 0,
          width: isDesktop
            ? `calc(100% - ${theme.layout.nav.panelWidth}px)`
            : "100%",
          height: `calc(100% - ${theme.layout.nav.height}px - ${isDesktop ? 0 : theme.layout.footer.height}px)`,
        })}
      >
        <Container
          maxWidth="md"
          sx={(theme) => ({
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: theme.layout.page.header.height,
          })}
        >
          <PageHeader
            title={<NavBreadcrumbs />}
            {...currentMatch?.loaderData?.slotProps?.pageHeader}
          />
        </Container>
        <Box
          sx={(theme) => ({
            position: "absolute",
            top: theme.layout.page.header.height,
            bottom: 0,
            left: 0,
            right: 0,
            height: `calc(100% - ${theme.layout.page.header.height}px)`,
            overflow: "auto",
          })}
        >
          <Outlet />
        </Box>
      </Box>
      {!isDesktop && (
        <Footer
          sx={(theme) => ({
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            height: theme.layout.footer.height,
          })}
        />
      )}
    </>
  );
}
