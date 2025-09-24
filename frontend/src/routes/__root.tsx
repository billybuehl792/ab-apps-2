import { type ContextType } from "react";
import { createRootRouteWithContext } from "@tanstack/react-router";
import { QueryClient } from "@tanstack/react-query";
import { Button } from "@mui/material";
import AuthContext from "@/store/context/AuthContext";
import FullScreen from "@/components/layout/FullScreen";
import StatusCard from "@/components/cards/StatusCard";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  auth: ContextType<typeof AuthContext>;
}>()({
  pendingComponent: () => (
    <FullScreen>
      <StatusCard
        loading="Loading..."
        description="Initializing the application..."
      />
    </FullScreen>
  ),
  errorComponent: ({ error }) => (
    <FullScreen>
      <StatusCard
        error={error}
        description={
          <Button size="small" onClick={() => location.reload()}>
            Reload Page
          </Button>
        }
      />
    </FullScreen>
  ),
});
