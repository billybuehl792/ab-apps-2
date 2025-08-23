import StatusCard from "@/components/cards/StatusCard";
import { queryUtils } from "@/store/utils/queries";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/sign-out")({
  validateSearch: (search: Record<string, unknown>): { redirect?: string } => ({
    redirect: (search.redirect as string) || undefined,
  }),
  beforeLoad: async ({ context, search }) => {
    context.auth.signOut();
    await queryUtils.delay(1000);
    throw redirect({ to: "/sign-in", replace: true, search });
  },
  pendingComponent: () => <StatusCard loading description="Signing out..." />,
});
