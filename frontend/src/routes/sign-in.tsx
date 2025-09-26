import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, Stack } from "@mui/material";
import useAuth from "@/store/hooks/useAuth";
import SignInForm from "@/containers/forms/SignInForm";
import FullScreen from "@/components/layout/FullScreen";
import StatusCard from "@/components/cards/StatusCard";

export const Route = createFileRoute("/sign-in")({
  validateSearch: (search: Record<string, unknown>): { redirect?: string } => ({
    redirect: (search.redirect as string) || undefined,
  }),
  beforeLoad: ({ context, search }) => {
    const isAuthenticated = !!context.auth.me;
    if (isAuthenticated)
      throw redirect({ to: search.redirect ?? "/", replace: true });
  },
  component: RouteComponent,
  pendingComponent: () => (
    <FullScreen>
      <StatusCard loading="Loading sign in..." />
    </FullScreen>
  ),
});

function RouteComponent() {
  /** Values */

  const auth = useAuth();
  const router = useRouter();

  return (
    <FullScreen maxWidth="sm">
      <Stack component={Card}>
        <CardHeader title="Sign In" />
        <CardContent>
          <SignInForm
            onSubmit={auth.signIn}
            onSuccess={() => router.invalidate()}
          />
        </CardContent>
      </Stack>
    </FullScreen>
  );
}
