import { type ContextType } from "react";
import { createRootRouteWithContext } from "@tanstack/react-router";
import { QueryClient } from "@tanstack/react-query";
import AuthContext from "@/store/context/AuthContext";
import FullScreen from "@/components/layout/FullScreen";
import StatusCard from "@/components/cards/StatusCard";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  auth: ContextType<typeof AuthContext>;
}>()({
  pendingComponent: () => (
    <FullScreen>
      <StatusCard loading="Loading app..." />
    </FullScreen>
  ),
  errorComponent: ({ error }) => (
    <FullScreen>
      <StatusCard error={error} />
    </FullScreen>
  ),
});
