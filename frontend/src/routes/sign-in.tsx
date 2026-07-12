import { type ComponentProps } from "react";
import {
  createFileRoute,
  type FileRoutesByPath,
  redirect,
} from "@tanstack/react-router";
import z from "zod";
import { Card, CardContent, CardHeader, Divider, Stack } from "@mui/material";
import sanitizeSearchParams from "@/store/middleware/sanitizeSearchParams";
import useAuth from "@/store/hooks/useAuth";
import FullScreen from "@/components/layout/FullScreen";
import SignInForm from "@/containers/forms/SignInForm";
import StatusWrapper from "@/components/layout/StatusWrapper";
import ButtonLink from "@/components/links/ButtonLink";
import { errorUtils } from "@/store/utils/error";

const APP_ROUTE_PATH: keyof FileRoutesByPath = "/app";
const paramsSchema = z.object({
  force: z.coerce
    .boolean()
    .optional()
    .transform((value) => !!value || undefined)
    .catch(undefined),
  redirect: z
    .string()
    .optional()
    .transform((redirect) =>
      !!redirect &&
      redirect.startsWith(APP_ROUTE_PATH) &&
      redirect !== APP_ROUTE_PATH
        ? redirect
        : undefined,
    )
    .catch(undefined),
});

export const Route = createFileRoute("/sign-in")({
  validateSearch: paramsSchema,
  search: { middlewares: [sanitizeSearchParams(paramsSchema)] },
  beforeLoad: async ({ context, search }) => {
    if (search.force) await context.auth.signOut();
    else {
      const isAuthenticated = !!context.auth.me;
      if (isAuthenticated)
        throw redirect({
          to: search.redirect ?? APP_ROUTE_PATH,
          replace: true,
        });
    }
  },
  component: RouteComponent,
  pendingComponent: () => (
    <FullScreen>
      <StatusWrapper loading="Loading sign in..." />
    </FullScreen>
  ),
  errorComponent: ({ error }) => (
    <FullScreen>
      <StatusWrapper
        error={{
          label: "Failed to load sign in page",
          description: errorUtils.getErrorMessage(error),
          actions: [
            <ButtonLink
              children="Retry"
              to="/sign-in"
              search={{ force: true }}
            />,
          ],
        }}
      />
    </FullScreen>
  ),
});

function RouteComponent() {
  /** Values */

  const auth = useAuth();
  const navigate = Route.useNavigate();
  const params = Route.useSearch();

  /** Callbacks */

  const handleSignIn: ComponentProps<typeof SignInForm>["onSubmit"] = async (
    data,
  ) => {
    await auth.signIn(data);
    navigate({ to: params.redirect, replace: true });
  };

  return (
    <FullScreen>
      <Stack spacing={1}>
        <Card>
          <CardHeader title="AB Apps" />
          <Divider />
          <CardContent>
            <SignInForm onSubmit={handleSignIn} />
          </CardContent>
        </Card>
        <ButtonLink
          children="Forgot password?"
          to="/forgot-password"
          color="inherit"
          variant="text"
          sx={{ width: "fit-content" }}
        />
      </Stack>
    </FullScreen>
  );
}
