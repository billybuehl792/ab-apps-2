import type { ComponentProps } from "react";
import { createFileRoute, stripSearchParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Container } from "@mui/material";
import sanitizeSearchParams from "@/store/middleware/sanitizeSearchParams";
import useContact from "@/store/hooks/useContact";
import { contactListRequestSchema } from "@/store/schemas/contacts";
import ContactList from "@/containers/lists/ContactList";
import ContactListCard from "@/containers/lists/ContactList/components/cards/ContactListCard";
import ContactCreateButton from "@/containers/buttons/ContactCreateButton";
import { contactQueries } from "@/store/queries/contacts";

const paramsSchema = contactListRequestSchema.shape.params;
const defaultParams = paramsSchema.parse({});

export const Route = createFileRoute("/app/contacts/")({
  validateSearch: paramsSchema,
  search: {
    middlewares: [
      sanitizeSearchParams(paramsSchema),
      stripSearchParams(defaultParams),
    ],
  },
  component: RouteComponent,
  staticData: {
    PageHeaderEndContentComponent: () => <ContactCreateButton variant="text" />,
  },
});

function RouteComponent() {
  /* Values */

  const params = Route.useSearch();
  const navigate = Route.useNavigate();

  /** Queries */

  const contactListQuery = useQuery(contactQueries.list({ params }));

  /** Callbacks */

  const handleOnParamsChange = (newParams: Partial<typeof params>) =>
    navigate({
      to: ".",
      search: (s) => ({ ...s, ...newParams }),
      replace: true,
    });

  return (
    <Container sx={{ pb: 2 }}>
      <ContactList
        items={contactListQuery.data?.results ?? []}
        count={contactListQuery.data?.count ?? -1}
        page={params.page}
        pageSize={params.page_size}
        search={params.search}
        ordering={params.ordering ?? null}
        loading={contactListQuery.isLoading}
        error={contactListQuery.error}
        onPageChange={(page) => handleOnParamsChange({ page })}
        onPageSizeChange={(page_size) =>
          handleOnParamsChange({ page: 1, page_size })
        }
        onSearchChange={(search) => handleOnParamsChange({ page: 1, search })}
        onOrderingChange={(ordering) =>
          handleOnParamsChange({ page: 1, ordering: ordering ?? undefined })
        }
        renderCard={(contact) => <ListCard contact={contact} />}
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

const ListCard = ({
  contact,
  ...props
}: ComponentProps<typeof ContactListCard>) => {
  /** Values */

  const { options } = useContact(contact);

  return (
    <ContactListCard
      contact={contact}
      options={options}
      link={{ to: "/app/contacts/$id", params: { id: contact.id } }}
      {...props}
    />
  );
};
