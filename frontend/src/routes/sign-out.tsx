import { createFileRoute, redirect } from "@tanstack/react-router";
import StatusCard from "@/components/cards/StatusCard";
import FullScreen from "@/components/layout/FullScreen";
import Button from "@mui/material/Button";
import { Stack, Typography } from "@mui/material";

export const Route = createFileRoute("/sign-out")({
  validateSearch: (search: Record<string, unknown>): { redirect?: string } => ({
    redirect: (search.redirect as string) || undefined,
  }),
  beforeLoad: async ({ context, search }) => {
    await context.auth.signOut();
    throw redirect({ to: "/sign-in", replace: true, search });
  },
  component: () => <FullScreen />,
  pendingComponent: () => (
    <FullScreen>
      <StatusCard loading="Signing out..." />
    </FullScreen>
  ),
  errorComponent: ({ error }) => (
    <FullScreen>
      <StatusCard
        error={error}
        description={
          <Stack spacing={2} alignItems="center">
            <Typography variant="body2" color="textSecondary">
              Something went wrong while signing out...
            </Typography>
            <Button size="small" onClick={() => location.reload()}>
              Reload Page
            </Button>
          </Stack>
        }
      />
    </FullScreen>
  ),
});
