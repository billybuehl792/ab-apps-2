import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Box, useMediaQuery } from "@mui/material";
import { accountQueries } from "@/store/queries/account";
import ProfileProvider from "@/containers/providers/ProfileProvider";
import FullScreen from "@/components/layout/FullScreen";
import StatusCard from "@/components/cards/StatusCard";
import NavBar from "@/containers/layout/NavBar";
import NavPanel from "@/containers/layout/NavPanel";
import { NAV_HEIGHT, NAV_PANEL_WIDTH } from "@/store/constants/layout";

export const Route = createFileRoute("/app")({
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated)
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
});

function RouteComponent() {
  /** Values */

  const isDesktop = useMediaQuery(({ breakpoints }) => breakpoints.up("sm"));

  /** Queries */

  const meQuery = useQuery(accountQueries.me());

  if (!meQuery.isSuccess)
    return (
      <FullScreen>
        <StatusCard
          loading={meQuery.isLoading && "Loading user..."}
          error={meQuery.error}
        />
      </FullScreen>
    );
  return (
    <ProfileProvider me={meQuery.data}>
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
    </ProfileProvider>
  );
}
