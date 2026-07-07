import type { ComponentProps } from "react";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { ArrowBack, CheckCircle } from "@mui/icons-material";
import FullScreen from "@/components/layout/FullScreen";
import StatusWrapper from "@/components/layout/StatusWrapper";
import ButtonLink from "@/components/links/ButtonLink";
import CustomLink from "@/components/links/CustomLink";
import ResetPasswordForm from "@/containers/forms/ResetPasswordForm";
import { accountQueries } from "@/store/queries/account";
import { accountMutations } from "@/store/mutations/account";
import { errorUtils } from "@/store/utils/error";

export const Route = createFileRoute("/reset-password/$encodedUserId/$token")({
  beforeLoad: ({ context }) => {
    const isAuthenticated = !!context.auth.me;
    if (isAuthenticated) throw redirect({ to: "/app", replace: true });
  },
  loader: async ({ context, params }) => {
    // Check if params are valid
    await context.queryClient.fetchQuery(
      accountQueries.auth.resetPassword(params).detail,
    );
  },
  component: RouteComponent,
  pendingComponent: () => (
    <FullScreen>
      <StatusWrapper loading="Loading reset password..." />
    </FullScreen>
  ),
  errorComponent: ({ error }) => (
    <FullScreen>
      <StatusWrapper
        error={{
          label: errorUtils.getErrorMessage(error),
          description:
            "This link is invalid or has expired. Please request a new password reset link.",
          actions: [
            <ButtonLink to="/sign-in">Sign in</ButtonLink>,
            <ButtonLink to="/forgot-password">Get a new link</ButtonLink>,
          ],
        }}
      />
    </FullScreen>
  ),
});

function RouteComponent() {
  /** Values */

  const params = Route.useParams();
  const snackbar = useSnackbar();

  /** Mutations */

  const resetPasswordMutation = useMutation(
    accountMutations.auth.resetPassword(params),
  );

  /** Callbacks */

  const handleOnSubmit: ComponentProps<typeof ResetPasswordForm>["onSubmit"] = (
    data,
  ) =>
    resetPasswordMutation.mutateAsync(data, {
      onSuccess: () => {
        snackbar.enqueueSnackbar(
          "Password reset successful! You can now sign in with your new password.",
          { variant: "success" },
        );
      },
      onError: (error) =>
        snackbar.enqueueSnackbar(errorUtils.getErrorMessage(error), {
          variant: "error",
        }),
    });

  return (
    <FullScreen>
      <Stack spacing={1}>
        <Card>
          <CardHeader title="Reset Password" />
          <Divider />
          <Stack component={CardContent} spacing={2}>
            {resetPasswordMutation.isSuccess ? (
              <>
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
              </>
            ) : (
              <ResetPasswordForm onSubmit={handleOnSubmit} />
            )}
          </Stack>
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
