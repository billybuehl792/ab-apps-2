import { createFileRoute, stripSearchParams } from "@tanstack/react-router";
import { userListRequestSchema } from "@/store/schemas/account";
import StatusWrapper from "@/components/layout/StatusWrapper";
import { Container } from "@mui/material";
import sanitizeSearchParams from "@/store/middleware/sanitizeSearchParams";

const paramsSchema = userListRequestSchema.shape.params;
const defaultParams = paramsSchema.parse({});

export const Route = createFileRoute("/app/admin/users/")({
  validateSearch: paramsSchema,
  search: {
    middlewares: [
      sanitizeSearchParams(paramsSchema),
      stripSearchParams(defaultParams),
    ],
  },
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
