import { type ComponentProps } from "react";
import {
  createFileRoute,
  type FileRoutesByPath,
  redirect,
  stripSearchParams,
  useRouter,
} from "@tanstack/react-router";
import z from "zod";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import { Card, CardContent, CardHeader, Divider, Stack } from "@mui/material";
import useAuth from "@/store/hooks/useAuth";
import FullScreen from "@/components/layout/FullScreen";
import SignInForm from "@/containers/forms/SignInForm";
import StatusWrapper from "@/components/layout/StatusWrapper";
import CustomLink from "@/components/links/CustomLink";

const APP_ROUTE_PATH: keyof FileRoutesByPath = "/app";
const paramsSchema = z.object({
  redirect: z.coerce
    .string()
    .optional()
    .transform((value) =>
      value?.startsWith(APP_ROUTE_PATH) ? value : APP_ROUTE_PATH,
    )
    .catch(APP_ROUTE_PATH),
});
const defaultParams = paramsSchema.parse({});

export const Route = createFileRoute("/sign-in")({
  validateSearch: zodValidator(fallback(paramsSchema, defaultParams)),
  search: { middlewares: [stripSearchParams(defaultParams)] },
  beforeLoad: ({ context, search }) => {
    const isAuthenticated = !!context.auth.me;
    if (isAuthenticated) throw redirect({ to: search.redirect, replace: true });
  },
  component: RouteComponent,
  pendingComponent: () => (
    <FullScreen>
      <StatusWrapper loading="Loading sign in..." />
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
    data,
  ) => {
    await auth.signIn(data);
    router.navigate({ to: params.redirect, replace: true });
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
        <CustomLink
          label="Forgot password?"
          to="/forgot-password"
          color="inherit"
          width="fit-content"
        />
      </Stack>
    </FullScreen>
  );
}
