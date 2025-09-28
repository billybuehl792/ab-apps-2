import { createRootRouteWithContext } from "@tanstack/react-router";
import { Button } from "@mui/material";
import FullScreen from "@/components/layout/FullScreen";
import StatusCard from "@/components/cards/StatusCard";
import type { GlobalRouterContext } from "@/store/types/router";

export const Route = createRootRouteWithContext<GlobalRouterContext>()({
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
