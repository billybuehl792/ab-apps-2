import {
  createFileRoute,
  redirect,
  stripSearchParams,
} from "@tanstack/react-router";
import z from "zod";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import { ErrorOutline } from "@mui/icons-material";
import FullScreen from "@/components/layout/FullScreen";
import StatusWrapper from "@/components/layout/StatusWrapper";
import CustomLink from "@/components/links/CustomLink";
import { errorUtils } from "@/store/utils/error";
import { Card, CardContent, Typography } from "@mui/material";

const paramsSchema = z.object({
  redirect: z.coerce.string().optional().catch(undefined),
});
const defaultParams = paramsSchema.parse({});

export const Route = createFileRoute("/sign-out")({
  validateSearch: zodValidator(fallback(paramsSchema, defaultParams)),
  search: { middlewares: [stripSearchParams(defaultParams)] },
  beforeLoad: async ({ context, search }) => {
    await context.auth.signOut();
    throw redirect({ to: "/sign-in", replace: true, search });
  },
  component: RouteComponent,
  pendingComponent: () => (
    <FullScreen>
      <StatusWrapper loading="Signing out..." />
    </FullScreen>
  ),
  errorComponent: ({ error }) => (
    <FullScreen>
      <StatusWrapper
        error={{
          label: "Sign out failed",
          description: errorUtils.getErrorMessage(error),
          icon: <ErrorOutline />,
          actions: [<CustomLink label="Go to Sign In" to="/sign-in" />],
        }}
      />
    </FullScreen>
  ),
});

function RouteComponent() {
  return (
    <FullScreen maxWidth="xs">
      <Card>
        <CardContent>
          <Typography variant="h1" textAlign="center">
            You have been signed out
          </Typography>
        </CardContent>
      </Card>
    </FullScreen>
  );
}
