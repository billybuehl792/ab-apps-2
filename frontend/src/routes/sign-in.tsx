import { useState } from "react";
import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Stack,
  TextField,
} from "@mui/material";
import useAuth from "@/store/hooks/useAuth";
import FullScreen from "@/components/layout/FullScreen";
import StatusCard from "@/components/cards/StatusCard";
import { errorUtils } from "@/store/utils/error";

const signInFormSchema = z.object({
  username: z
    .string()
    .min(1, { message: "Username is required" })
    .max(64, { message: "Max length is 64" }),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .max(128, { message: "Max length is 128" }),
});

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
  const [disabled, setDisabled] = useState(false);

  /** Values */

  const auth = useAuth();
  const router = useRouter();
  const methods = useForm({
    resolver: zodResolver(signInFormSchema),
    defaultValues: { username: "", password: "" },
    disabled,
    delayError: 300,
  });

  /** Callbacks */

  const handleSignIn = methods.handleSubmit(async (data) => {
    try {
      setDisabled(true);
      await auth.signIn(data);
      router.invalidate();
    } catch (error) {
      setTimeout(() =>
        methods.setError(
          "password",
          { type: "server", message: errorUtils.getErrorMessage(error) },
          { shouldFocus: true }
        )
      );
    } finally {
      setDisabled(false);
    }
  });

  return (
    <FullScreen maxWidth="sm">
      <Stack component={Card}>
        <CardHeader title="Sign In" />
        <CardContent>
          <Stack
            component="form"
            noValidate
            spacing={2}
            onSubmit={handleSignIn}
          >
            <TextField
              label="Username"
              required
              error={!!methods.formState.errors.username}
              helperText={methods.formState.errors.username?.message}
              {...methods.register("username")}
            />
            <TextField
              label="Password"
              type="password"
              required
              error={!!methods.formState.errors.password}
              helperText={methods.formState.errors.password?.message}
              {...methods.register("password")}
            />
            <Stack direction="row" justifyContent="end">
              <Button
                type="submit"
                disabled={methods.formState.disabled}
                loading={methods.formState.isSubmitting}
              >
                Sign In
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Stack>
    </FullScreen>
  );
}
