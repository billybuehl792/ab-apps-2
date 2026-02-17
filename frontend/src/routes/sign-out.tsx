import { createFileRoute, redirect } from "@tanstack/react-router";
import z from "zod";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import { ErrorOutline } from "@mui/icons-material";
import FullScreen from "@/components/layout/FullScreen";
import StatusWrapper from "@/components/layout/StatusWrapper";
import { errorUtils } from "@/store/utils/error";

export const Route = createFileRoute("/sign-out")({
  validateSearch: zodValidator(
    z.object({
      redirect: fallback(z.string().optional(), undefined),
    }),
  ),
  beforeLoad: async ({ context, search }) => {
    await context.auth.signOut();
    throw redirect({ to: "/sign-in", replace: true, search });
  },
  component: () => <FullScreen />,
  pendingComponent: () => (
    <FullScreen>
      <StatusWrapper loading="Signing out..." />
    </FullScreen>
  ),
  errorComponent: ({ error }) => (
    <FullScreen>
      <StatusWrapper
        error={{
          label: "Sign out failed",
          description: errorUtils.getErrorMessage(error),
          icon: <ErrorOutline fontSize="large" />,
          actions: [],
        }}
      />
    </FullScreen>
  ),
});
