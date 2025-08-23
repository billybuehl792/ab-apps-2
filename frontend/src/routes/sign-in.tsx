import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import {
  Button,
  Card,
  CardContent,
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
    const isAuthenticated = !!context.auth.user;
    if (isAuthenticated)
      redirect({ to: search.redirect ?? "/", replace: true, throw: true });
  },
  component: RouteComponent,
});

function RouteComponent() {
  /** Values */

  const auth = useAuth();
  const router = useRouter();

  /** Callbacks */

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    auth.signIn.mutate(
      { username, password },
      { onSuccess: () => router.invalidate() }
    );
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
            <Button type="submit" variant="outlined" color="primary">
              Sign In
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
