import { type ComponentProps } from "react";
import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import z from "zod";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import { Card, CardContent, CardHeader, Stack } from "@mui/material";
import useAuth from "@/store/hooks/useAuth";
import FullScreen from "@/components/layout/FullScreen";
import StatusCard from "@/components/cards/StatusCard";
import SignInForm from "@/containers/forms/SignInForm";

export const Route = createFileRoute("/sign-in")({
  validateSearch: zodValidator(
    z.object({
      redirect: fallback(
        z
          .string()
          .optional()
          .refine((value) => (value?.startsWith("/app") ? value : undefined)),
        undefined
      ),
    })
  ),
  beforeLoad: ({ context, search }) => {
    const isAuthenticated = !!context.auth.me;
    if (isAuthenticated)
      throw redirect({ to: search.redirect ?? "/app", replace: true });
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
  const params = Route.useSearch();

  /** Callbacks */

  const handleSignIn: ComponentProps<typeof SignInForm>["onSubmit"] = async (
    data
  ) => {
    await auth.signIn(data);
    router.navigate({ to: params.redirect ?? "/app", replace: true });
  };

  return (
    <FullScreen maxWidth="sm">
      <Stack component={Card}>
        <CardHeader title="AB Apps Sign In" />
        <CardContent>
          <SignInForm onSubmit={handleSignIn} />
        </CardContent>
      </Stack>
    </FullScreen>
  );
}
