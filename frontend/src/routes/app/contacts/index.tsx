import { createFileRoute, stripSearchParams } from "@tanstack/react-router";
import { Container } from "@mui/material";
import ContactList, {
  type IContactListProps,
} from "@/containers/lists/ContactList";
import ContactCreateButton from "@/containers/buttons/ContactCreateButton";
import { contactListRequestSchema } from "@/store/schemas/contacts";

const paramsSchema = contactListRequestSchema.shape.params;
const defaultParams = paramsSchema.parse({});

export const Route = createFileRoute("/app/contacts/")({
  validateSearch: paramsSchema,
  search: { middlewares: [stripSearchParams(defaultParams)] },
  beforeLoad: () => ({
    crumb: null,
    pageHeaderEndContent: <ContactCreateButton variant="text" />,
  }),
  component: RouteComponent,
});

function RouteComponent() {
  /* Values */

  const params = Route.useSearch();
  const navigate = Route.useNavigate();

  /** Callbacks */

  const handleOnParamsChange: IContactListProps["onParamsChange"] = (
    newParams,
  ) =>
    navigate({
      to: ".",
      search: newParams,
      replace: true,
    });

  return (
    <Container sx={{ pb: 2 }}>
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
