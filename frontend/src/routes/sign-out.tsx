import { createFileRoute, redirect } from "@tanstack/react-router";
import StatusCard from "@/components/cards/StatusCard";
import FullScreen from "@/components/layout/FullScreen";

export const Route = createFileRoute("/sign-out")({
  validateSearch: (search: Record<string, unknown>): { redirect?: string } => ({
    redirect: (search.redirect as string) || undefined,
  }),
  beforeLoad: async ({ context, search }) => {
    await context.auth.signOut();
    throw redirect({ to: "/sign-in", replace: true, search });
  },
  pendingComponent: () => (
    <FullScreen>
      <StatusCard loading="Signing out..." />
    </FullScreen>
  ),
  component: () => <FullScreen />,
});
