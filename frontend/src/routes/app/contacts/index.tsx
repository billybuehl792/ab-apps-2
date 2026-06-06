import {
  createFileRoute,
  stripSearchParams,
  useNavigate,
} from "@tanstack/react-router";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import { Container } from "@mui/material";
import ContactCreateButton from "@/containers/buttons/ContactCreateButton";
import ContactList, {
  type IContactListProps,
} from "@/containers/lists/ContactList";
import { contactListRequestSchema } from "@/store/schemas/contacts";
import type { TRouteLoaderData } from "@/store/types/router";

const paramsSchema = contactListRequestSchema.shape.params;
const defaultParams = paramsSchema.parse({});

export const Route = createFileRoute("/app/contacts/")({
  validateSearch: zodValidator(fallback(paramsSchema, defaultParams)),
  search: { middlewares: [stripSearchParams(defaultParams)] },
  component: RouteComponent,
  loader: (): TRouteLoaderData => ({
    slotProps: {
      pageHeader: { endContent: <ContactCreateButton variant="text" /> },
    },
  }),
});

function RouteComponent() {
  /* Values */

  const params = Route.useSearch();
  const navigate = useNavigate();

  /** Callbacks */

  const handleOnParamsChange: IContactListProps["onParamsChange"] = (
    newParams,
  ) =>
    navigate({
      to: ".",
      search: paramsSchema.parse(newParams),
      replace: true,
    });

  return (
    <Container maxWidth="md" sx={{ pb: 2 }}>
      <ContactList
        params={params}
        onParamsChange={handleOnParamsChange}
        slotProps={{
          header: {
            position: "sticky",
            top: 0,
            zIndex: 1,
            bgcolor: "background.paper",
          },
        }}
      />
    </Container>
  );
}
