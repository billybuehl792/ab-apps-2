import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { Box, Container, useMediaQuery } from "@mui/material";
import { Home } from "@mui/icons-material";
import NavBar from "@/containers/layout/NavBar";
import NavPanel from "@/containers/layout/NavPanel";
import FullScreen from "@/components/layout/FullScreen";
import StatusCard from "@/components/cards/StatusCard";
import CustomLink from "@/components/links/CustomLink";
import { nav } from "@/store/constants/layout";

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
      <StatusCard loading="Loading app..." />
    </FullScreen>
  ),
  notFoundComponent: () => (
    <Container maxWidth="lg">
      <StatusCard
        error="Page not found :("
        description={
          <CustomLink label="Home" Icon={Home} to="/app/dashboard" />
        }
        my={2}
      />
    </Container>
  ),
});

function RouteComponent() {
  /** Values */

  const isDesktop = useMediaQuery(({ breakpoints }) => breakpoints.up("sm"));

  return (
    <>
      <NavBar height={nav.height} />
      {isDesktop && (
        <NavPanel width={nav.panelWidth} top={nav.height} left={0} bottom={0} />
      )}
      <Box
        component="main"
        sx={{
          position: "absolute",
          top: nav.height,
          height: `calc(100vh - ${nav.height}px)`,
          width: `calc(100% - ${isDesktop ? nav.panelWidth : 0}px)`,
          left: isDesktop ? nav.panelWidth : 0,
          overflow: "auto",
        }}
      >
        <Outlet />
      </Box>
    </>
  );
}
