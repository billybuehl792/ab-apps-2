import { type ContextType } from "react";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { QueryClient } from "@tanstack/react-query";
import { Box } from "@mui/material";
import AuthContext from "@/store/context/AuthContext";
import NavBar from "@/containers/layout/NavBar";
import FullScreen from "@/components/layout/FullScreen";
import StatusCard from "@/components/cards/StatusCard";

const NAV_HEIGHT = 64;

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  auth: ContextType<typeof AuthContext>;
}>()({
  component: () => (
    <>
      <NavBar height={NAV_HEIGHT} />
      <Box
        component="main"
        sx={{
          position: "absolute",
          top: NAV_HEIGHT,
          height: `calc(100vh - ${NAV_HEIGHT}px)`,
          width: "100vw",
          overflow: "auto",
        }}
      >
        <Box p={2}>
          <Outlet />
        </Box>
      </Box>
    </>
  ),
  pendingComponent: () => (
    <FullScreen>
      <StatusCard loading description="Loading app..." />
    </FullScreen>
  ),
  errorComponent: ({ error }) => (
    <FullScreen>
      <StatusCard error={error} />
    </FullScreen>
  ),
});
