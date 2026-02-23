import { type ComponentProps } from "react";
import {
  createFileRoute,
  redirect,
  stripSearchParams,
  useRouter,
} from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import useAuth from "@/store/hooks/useAuth";
import FullScreen from "@/components/layout/FullScreen";
import CustomLink from "@/components/links/CustomLink";
import StatusWrapper from "@/components/layout/StatusWrapper";
import SendPasswordResetEmailForm from "@/containers/forms/SendPasswordResetEmailForm";

export const Route = createFileRoute("/forgot-password")({
  validateSearch: () => ({}),
  search: { middlewares: [stripSearchParams(true)] },
  beforeLoad: ({ context }) => {
    const isAuthenticated = !!context.auth.me;
    if (isAuthenticated) throw redirect({ to: "/app", replace: true });
  },
  component: RouteComponent,
  pendingComponent: () => (
    <FullScreen>
      <StatusWrapper loading="Loading forgot password..." />
    </FullScreen>
  ),
});

function RouteComponent() {
  /** Values */

  const auth = useAuth();
  const router = useRouter();
  const params = Route.useSearch();

  /** Callbacks */

  const handleSendResetLink: ComponentProps<
    typeof SendPasswordResetEmailForm
  >["onSubmit"] = async (data) => {
    // await auth.signIn(data);
    // router.navigate({ to: params.redirect, replace: true });
  };

  return (
    <FullScreen maxWidth="xs">
      <Stack spacing={1}>
        <Card>
          <CardHeader title="Reset your password" />
          <Divider />
          <CardContent>
            <Typography
              variant="body2"
              textAlign="center"
              color="textSecondary"
            >
              Enter your user account's verified email address and we will send
              you a password reset link.
            </Typography>
          </CardContent>
          <CardContent>
            <SendPasswordResetEmailForm onSubmit={handleSendResetLink} />
          </CardContent>
        </Card>
        <CustomLink
          label="Sign in"
          icon={<ArrowBack fontSize="large" />}
          to="/sign-in"
          color="inherit"
          width="fit-content"
        />
      </Stack>
    </FullScreen>
  );
}
