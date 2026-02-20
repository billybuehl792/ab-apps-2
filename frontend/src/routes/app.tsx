import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { Box, Container, Paper, useMediaQuery } from "@mui/material";
import NavBar from "@/containers/layout/NavBar";
import FullScreen from "@/components/layout/FullScreen";
import StatusWrapper from "@/components/layout/StatusWrapper";
import NavList from "@/containers/lists/NavList";
import PageNotFoundCard from "@/components/cards/PageNotFoundCard";

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
  component: RouteComponent,
  pendingComponent: () => (
    <FullScreen>
      <StatusWrapper loading="Loading app..." />
    </FullScreen>
  ),
  notFoundComponent: () => (
    <Container sx={{ my: 2 }}>
      <PageNotFoundCard />
    </Container>
  ),
});

function RouteComponent() {
  /** Values */

  const isDesktop = useMediaQuery(({ breakpoints }) => breakpoints.up("sm"));

  return (
    <>
      <NavBar sx={{ height: (theme) => theme.layout.nav.height }} />
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
        sx={({ layout }) => ({
          position: "absolute",
          top: layout.nav.height,
          height: `calc(100vh - ${layout.nav.height}px)`,
          width: `calc(100% - ${isDesktop ? layout.nav.panelWidth : 0}px)`,
          left: isDesktop ? layout.nav.panelWidth : 0,
          overflow: "auto",
        })}
      >
        <Outlet />
      </Box>
    </>
  );
}
