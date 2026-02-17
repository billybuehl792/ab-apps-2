import { createRootRouteWithContext } from "@tanstack/react-router";
import { Button } from "@mui/material";
import FullScreen from "@/components/layout/FullScreen";
import StatusWrapper from "@/components/layout/StatusWrapper";
import { errorUtils } from "@/store/utils/error";
import type { IGlobalRouterContext } from "@/store/types/router";

export const Route = createRootRouteWithContext<IGlobalRouterContext>()({
  pendingComponent: () => (
    <FullScreen>
      <StatusWrapper
        loading={{
          label: "Loading...",
          description: "Initializing the application...",
        }}
      />
    </FullScreen>
  ),
  errorComponent: ({ error }) => (
    <FullScreen>
      <StatusWrapper
        error={{
          label: "An error occurred :(",
          description: errorUtils.getErrorMessage(error),
          actions: [
            <Button size="small" onClick={() => location.reload()}>
              Reload Page
            </Button>,
          ],
        }}
      />
    </FullScreen>
  ),
});
