import { createFileRoute, redirect } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import FullScreen from "@/components/layout/FullScreen";
import PageNotFoundCard from "@/components/cards/PageNotFoundCard";
import StatusWrapper from "@/components/layout/StatusWrapper";
import { authEndpoints } from "@/store/constants/account";
import { ArrowBack, CheckCircle } from "@mui/icons-material";
import CustomLink from "@/components/links/CustomLink";
import ResetPasswordForm from "@/containers/forms/ResetPasswordForm";
import { ComponentProps } from "react";
import { useMutation } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { errorUtils } from "@/store/utils/error";
import ButtonLink from "@/components/links/ButtonLink";

export const Route = createFileRoute("/reset-password/$encodedUserId/$token")({
  beforeLoad: ({ context }) => {
    const isAuthenticated = !!context.auth.me;
    if (isAuthenticated) throw redirect({ to: "/app", replace: true });
  },
  loader: async ({ context, params }) => {
    // Check if params are valid
    await context.queryClient.fetchQuery({
      queryKey: authEndpoints.resetPassword(params).id,
      queryFn: () => authEndpoints.resetPassword(params).get(),
    });
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
  notFoundComponent: () => (
    <FullScreen>
      <PageNotFoundCard />
    </FullScreen>
  ),
});

function RouteComponent() {
  /** Values */

  const params = Route.useParams();
  const snackbar = useSnackbar();

  /** Mutations */

  const resetPasswordMutation = useMutation({
    mutationKey: authEndpoints.resetPassword(params).id,
    mutationFn: authEndpoints.resetPassword(params).post,
  });

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
