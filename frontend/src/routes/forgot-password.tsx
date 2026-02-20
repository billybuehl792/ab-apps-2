import { type ComponentProps } from "react";
import {
  createFileRoute,
  type FileRoutesByPath,
  redirect,
  stripSearchParams,
  useRouter,
} from "@tanstack/react-router";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import z from "zod";
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

export const Route = createFileRoute("/forgot-password")({
  validateSearch: zodValidator(fallback(paramsSchema, defaultParams)),
  search: { middlewares: [stripSearchParams(defaultParams)] },
  beforeLoad: ({ context, search }) => {
    const isAuthenticated = !!context.auth.me;
    if (isAuthenticated) throw redirect({ to: search.redirect, replace: true });
  },
  component: RouteComponent,
  pendingComponent: () => (
    <FullScreen>
      <StatusWrapper loading="Loading password reset..." />
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
    router.navigate({ to: params.redirect, replace: true });
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
