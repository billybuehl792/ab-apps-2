import useAuth from "@/store/hooks/useAuth";
import { Button, Stack, Typography } from "@mui/material";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  /** Values */

  const auth = useAuth();

  return (
    <Stack spacing={2}>
      <Stack>
        <Typography variant="body1">Home</Typography>
        <Typography variant="caption">
          Current User: {auth.user?.username ?? "(none)"}
        </Typography>
      </Stack>
      <Stack direction="row" spacing={2}>
        <Button
          LinkComponent={Link}
          href="/sign-out"
          variant="outlined"
          size="small"
        >
          Sign Out Link
        </Button>
        <Button onClick={auth.signOut} variant="outlined" size="small">
          Sign Out
        </Button>
      </Stack>
    </Stack>
  );
}
