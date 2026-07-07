import { createRootRouteWithContext } from "@tanstack/react-router";
import FullScreen from "@/components/layout/FullScreen";
import PageNotFoundCard from "@/components/cards/PageNotFoundCard";
import StatusWrapper from "@/components/layout/StatusWrapper";
import BackButton from "@/containers/buttons/BackButton";
import { errorUtils } from "@/store/utils/error";
import type { IGlobalRouterContext } from "@/store/types/router";

export const Route = createRootRouteWithContext<IGlobalRouterContext>()({
  pendingComponent: () => (
    <FullScreen>
      <StatusWrapper loading />
    </FullScreen>
  ),
  errorComponent: ({ error }) => (
    <FullScreen>
      <StatusWrapper
        error={{
          label: errorUtils.getErrorMessage(error),
          actions: [<BackButton />],
        }}
      />
    </FullScreen>
  ),
  notFoundComponent: () => (
    <FullScreen>
      <PageNotFoundCard />
    </FullScreen>
  ),
});
