import { createFileRoute, stripSearchParams } from "@tanstack/react-router";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import { Add } from "@mui/icons-material";
import { userListRequestSchema } from "@/store/schemas/account";
import StatusWrapper from "@/components/layout/StatusWrapper";
import ButtonLink from "@/components/links/ButtonLink";
import { Container } from "@mui/material";

const paramsSchema = userListRequestSchema.shape.params;
const defaultParams = paramsSchema.parse({});

export const Route = createFileRoute("/app/admin/users/")({
  validateSearch: zodValidator(fallback(paramsSchema, defaultParams)),
  search: { middlewares: [stripSearchParams(defaultParams)] },
  beforeLoad: () => ({
    crumb: null,
    pageHeaderEndContent: (
      <ButtonLink
        variant="text"
        to="/app/admin/users/create"
        startIcon={<Add />}
        children="Create New"
      />
    ),
  }),
  component: RouteComponent,
});

function RouteComponent() {
  /** Values */

  /** Callbacks */

  return (
    <Container>
      <StatusWrapper
        empty={{ label: "TODO", description: "add user list" }}
        my={2}
      />
    </Container>
  );
}
