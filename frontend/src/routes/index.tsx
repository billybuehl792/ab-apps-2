import StatusCard from "@/components/cards/StatusCard";
import FullScreen from "@/components/layout/FullScreen";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: () => redirect({ to: "/app", replace: true, throw: true }),
  pendingComponent: () => (
    <FullScreen>
      <StatusCard loading="Redirecting..." />
    </FullScreen>
  ),
});
