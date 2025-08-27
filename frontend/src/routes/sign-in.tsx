import { useState } from "react";
import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import {
  Button,
  Card,
  CardContent,
  FormHelperText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import useAuth from "@/store/hooks/useAuth";

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
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  /** Values */

  const auth = useAuth();
  const router = useRouter();

  /** Callbacks */

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const formData = new FormData(event.currentTarget);

    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    setSubmitting(true);
    auth
      .signIn({ username, password })
      .then(() => router.invalidate())
      .catch((error) => setError(error.message))
      .finally(() => setSubmitting(false));
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h6">Sign In</Typography>
      <Card variant="outlined">
        <CardContent>
          <Stack component="form" spacing={2} onSubmit={handleSubmit}>
            <TextField
              name="username"
              label="Username"
              variant="outlined"
              fullWidth
              required
            />
            <TextField
              name="password"
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              required
            />
            {!!error && <FormHelperText error>{error}</FormHelperText>}
            <Button
              type="submit"
              variant="outlined"
              color="primary"
              loading={submitting}
            >
              Sign In
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
