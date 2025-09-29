import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { Box, Container, useMediaQuery } from "@mui/material";
import { Home } from "@mui/icons-material";
import NavBar from "@/containers/layout/NavBar";
import NavPanel from "@/containers/layout/NavPanel";
import FullScreen from "@/components/layout/FullScreen";
import StatusCard from "@/components/cards/StatusCard";
import CustomLink from "@/components/links/CustomLink";
import { NAV_HEIGHT, NAV_PANEL_WIDTH } from "@/store/constants/layout";

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
      <NavBar height={NAV_HEIGHT} />
      {isDesktop && (
        <NavPanel
          width={NAV_PANEL_WIDTH}
          top={NAV_HEIGHT}
          left={0}
          bottom={0}
        />
      )}
      <Box
        component="main"
        sx={{
          position: "absolute",
          top: NAV_HEIGHT,
          height: `calc(100vh - ${NAV_HEIGHT}px)`,
          width: `calc(100% - ${isDesktop ? NAV_PANEL_WIDTH : 0}px)`,
          left: isDesktop ? NAV_PANEL_WIDTH : 0,
          overflow: "auto",
        }}
      >
        <Outlet />
      </Box>
    </>
  );
}
