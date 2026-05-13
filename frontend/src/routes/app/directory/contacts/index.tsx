import {
  createFileRoute,
  stripSearchParams,
  useNavigate,
} from "@tanstack/react-router";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import z from "zod";
import StatusWrapper from "@/components/layout/StatusWrapper";
import ContactCreateButton from "@/containers/buttons/ContactCreateButton";
import ContactList from "@/containers/lists/ContactList";
import { contactListRequestSchema } from "@/store/schemas/contacts";
import type { TRouteLoaderData } from "@/store/types/router";

const paramsSchema = contactListRequestSchema.shape.params;
const defaultParams = paramsSchema.parse({});

export const Route = createFileRoute("/app/directory/contacts/")({
  validateSearch: zodValidator(fallback(paramsSchema, defaultParams)),
  search: { middlewares: [stripSearchParams(defaultParams)] },
  pendingComponent: () => <StatusWrapper loading my={2} />,
  errorComponent: ({ error }) => <StatusWrapper error={error} my={2} />,
  component: RouteComponent,
  loader: (): TRouteLoaderData => ({
    slotProps: {
      pageHeader: { endContent: <ContactCreateButton variant="text" /> },
    },
  }),
});

function RouteComponent() {
  /** Values */

  const params = Route.useSearch();
  const navigate = useNavigate();

  /** Callbacks */

  const handleOnParamsChange = (
    newParams: z.input<typeof contactListRequestSchema.shape.params>,
  ) =>
    navigate({
      to: ".",
      search: contactListRequestSchema.shape.params.parse(newParams),
      replace: true,
    });

  return (
    <ContactList
      params={params}
      onParamsChange={(newParams) => handleOnParamsChange(newParams)}
      mb={2}
      slotProps={{
        header: {
          sx: {
            position: "sticky",
            top: (theme) => theme.layout.page.header.height,
            bgcolor: "background.paper",
            zIndex: 1,
          },
        },
      }}
    />
  );
}
