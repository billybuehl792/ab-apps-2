import { type ComponentProps } from "react";
import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { Card, CardContent, Stack, Typography } from "@mui/material";
import useAuth from "@/store/hooks/useAuth";
import SignInForm from "@/containers/forms/SignInForm";

export const Route = createFileRoute("/sign-in")({
  validateSearch: (search: Record<string, unknown>): { redirect?: string } => ({
    redirect: (search.redirect as string) || undefined,
  }),
  beforeLoad: ({ context, search }) => {
    if (context.auth.isAuthenticated)
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
    <Stack spacing={2} p={2}>
      <Typography variant="h6">Sign In</Typography>
      <Card>
        <CardContent>
          <SignInForm onSubmit={handleSignIn} />
        </CardContent>
      </Card>
    </Stack>
  );
}
