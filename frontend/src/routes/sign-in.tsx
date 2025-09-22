import { type ComponentProps } from "react";
import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, Stack } from "@mui/material";
import useAuth from "@/store/hooks/useAuth";
import SignInForm from "@/containers/forms/SignInForm";
import FullScreen from "@/components/layout/FullScreen";

export const Route = createFileRoute("/sign-in")({
  validateSearch: (search: Record<string, unknown>): { redirect?: string } => ({
    redirect: (search.redirect as string) || undefined,
  }),
  beforeLoad: ({ context, search }) => {
    if (context.auth.me)
      throw redirect({ to: search.redirect ?? "/", replace: true });
  },
  component: RouteComponent,
});

function RouteComponent() {
  /** Values */

  const auth = useAuth();
  const router = useRouter();

  /** Callbacks */

  const handleSignIn: ComponentProps<typeof SignInForm>["onSubmit"] = (data) =>
    auth.signIn(data).then(() => router.invalidate());

  return (
    <FullScreen>
      <Stack component={Card} width="100%" maxWidth={600}>
        <CardHeader title="Sign In" />
        <CardContent>
          <SignInForm spacing={2} onSubmit={handleSignIn} />
        </CardContent>
      </Stack>
    </FullScreen>
  );
}
