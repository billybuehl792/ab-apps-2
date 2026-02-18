import { createFileRoute, stripSearchParams } from "@tanstack/react-router";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import { Add } from "@mui/icons-material";
import { userListRequestSchema } from "@/store/schemas/account";
import StatusWrapper from "@/components/layout/StatusWrapper";
import CustomLink from "@/components/links/CustomLink";
import type { TRouteLoaderData } from "@/store/types/router";

const paramsSchema = userListRequestSchema.shape.params;
const defaultParams = paramsSchema.parse({});

export const Route = createFileRoute("/app/dashboard/admin/users/")({
  validateSearch: zodValidator(fallback(paramsSchema, defaultParams)),
  search: { middlewares: [stripSearchParams(defaultParams)] },
  pendingComponent: () => <StatusWrapper loading my={2} />,
  errorComponent: ({ error }) => <StatusWrapper error={error} my={2} />,
  component: RouteComponent,
  loader: (): TRouteLoaderData => ({
    slotProps: {
      pageHeader: {
        endContent: (
          <CustomLink
            label="Create"
            to="/app/dashboard/clients/create"
            icon={<Add />}
            disabled
          />
        ),
      },
    },
  }),
});

function RouteComponent() {
  /** Values */

  /** Callbacks */

  return (
    <StatusWrapper
      empty={{ label: "TODO", description: "add user list" }}
      my={2}
    />
  );
}
