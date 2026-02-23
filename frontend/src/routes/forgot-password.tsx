import { type ComponentProps } from "react";
import {
  createFileRoute,
  redirect,
  stripSearchParams,
} from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { ArrowBack, CheckCircle } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import FullScreen from "@/components/layout/FullScreen";
import CustomLink from "@/components/links/CustomLink";
import StatusWrapper from "@/components/layout/StatusWrapper";
import RequestPasswordResetForm from "@/containers/forms/RequestPasswordResetForm";
import { authEndpoints } from "@/store/constants/account";
import { errorUtils } from "@/store/utils/error";

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

  const snackbar = useSnackbar();

  /** Mutations */

  const requestPasswordResetMutation = useMutation({
    mutationKey: authEndpoints.requestPasswordReset().id,
    mutationFn: authEndpoints.requestPasswordReset().post,
  });

  /** Callbacks */

  const handleRequestPasswordReset: ComponentProps<
    typeof RequestPasswordResetForm
  >["onSubmit"] = (data) =>
    requestPasswordResetMutation.mutateAsync(data, {
      onSuccess: () =>
        snackbar.enqueueSnackbar(
          "Password reset email sent! Please check your inbox.",
          { variant: "success" },
        ),
      onError: (error) =>
        snackbar.enqueueSnackbar(errorUtils.getErrorMessage(error), {
          variant: "error",
        }),
    });

  return (
    <FullScreen>
      <Stack spacing={1}>
        <Card>
          <CardHeader title="Forgot Password" />
          <Divider />
          {requestPasswordResetMutation.isSuccess ? (
            <Stack component={CardContent} spacing={2}>
              <Stack direction="row" justifyContent="center">
                <CheckCircle color="success" fontSize="xl" />
              </Stack>
              <Typography
                variant="body2"
                textAlign="center"
                color="textSecondary"
              >
                If your email address is registered, a password reset link has
                been sent to your email.
              </Typography>
            </Stack>
          ) : (
            <>
              <CardContent>
                <Typography
                  variant="body2"
                  textAlign="center"
                  color="textSecondary"
                >
                  Enter your user account's verified email address and we will
                  send you a password reset link.
                </Typography>
              </CardContent>
              <CardContent>
                <RequestPasswordResetForm
                  onSubmit={handleRequestPasswordReset}
                />
              </CardContent>
            </>
          )}
        </Card>
        <CustomLink
          label="Back to sign in"
          icon={<ArrowBack fontSize="large" />}
          to="/sign-in"
          color="inherit"
          width="fit-content"
        />
      </Stack>
    </FullScreen>
  );
}
