import { useMemo, type ComponentProps } from "react";
import { useQuery } from "@tanstack/react-query";
import { Divider, Stack, type StackProps } from "@mui/material";
import PaginatedList from "@/components/lists/PaginatedList";
import DebouncedSearchField from "@/components/fields/DebouncedSearchField";
import ContactListCard from "./components/cards/ContactListCard";
import ContactCreateButton from "@/containers/buttons/ContactCreateButton";
import ContactListOrderingField from "./components/fields/ContactListOrderingField";
import { ContactIcons } from "@/store/constants/contacts";
import { EObjectChangeType } from "@/store/enums/api";
import { contactsQueries } from "@/store/queries/contacts";
import type { TContact, TContactListRequest } from "@/store/types/contacts";

type TCardProps = Partial<
  Omit<ComponentProps<typeof ContactListCard>, "contact">
>;

export interface IContactListProps extends StackProps {
  params: TContactListRequest["params"];
  onParamsChange: (newParams: TContactListRequest["params"]) => void;
  slotProps?: {
    header?: StackProps;
    card?: TCardProps | ((contact: TContact) => TCardProps);
  };
}

const ContactList: React.FC<IContactListProps> = ({
  params,
  onParamsChange,
  slotProps,
  ...props
}) => {
  /** Queries */

  const contactListQuery = useQuery(contactsQueries.list({ params }));

  /** Data */

  const total = useMemo(
    () => contactListQuery.data?.count ?? false,
    [contactListQuery.data],
  );

  /** Callbacks */

  const handleOnParamsChange: IContactListProps["onParamsChange"] = (
    newParams,
  ) => onParamsChange?.(newParams);

  const handleOnCardChange: TCardProps["onChange"] = (contact, type) => {
    if (type === EObjectChangeType.Delete) {
      const isLastItemOnPage =
        contactListQuery.data?.results.at(-1)?.id === contact.id;
      const isFirstPage = params.page === 1;
      if (isLastItemOnPage && !isFirstPage)
        handleOnParamsChange({ ...params, page: Math.max(1, params.page - 1) });
      else contactListQuery.refetch();
    }
  };

  return (
    <Stack position="relative" spacing={2} {...props}>
      <Stack {...slotProps?.header}>
        <Stack
          direction="row"
          spacing={1}
          py={2}
          flexWrap="wrap"
          useFlexGap
          alignItems="center"
          justifyContent="flex-start"
        >
          <DebouncedSearchField
            value={params.search}
            size="small"
            loading={!!contactListQuery.isLoading && !!params.search}
            onChange={(value) =>
              handleOnParamsChange({ ...params, page: 1, search: value })
            }
            sx={{ flex: 1 }}
          />
          <ContactListOrderingField
            value={params.ordering ?? null}
            disabled={contactListQuery.isLoading}
            size="small"
            onChange={(ordering) =>
              handleOnParamsChange({
                ...params,
                page: 1,
                ordering: ordering ?? undefined,
              })
            }
            sx={{ width: { xs: "100%", sm: 160 } }}
          />
        </Stack>
        <Divider />
      </Stack>
      <PaginatedList
        items={contactListQuery.data?.results ?? []}
        total={total}
        page={params.page}
        pageSize={params.page_size}
        loading={contactListQuery.isLoading}
        error={contactListQuery.error}
        empty={
          total === 0 && {
            label: "No Contacts Found",
            icon: <ContactIcons.List fontSize="large" />,
            ...(params.search
              ? { description: `No results for "${params.search}".` }
              : { actions: [<ContactCreateButton />] }),
          }
        }
        renderItem={(contact) => (
          <ContactListCard
            key={contact.id}
            contact={contact}
            onChange={handleOnCardChange}
            {...(typeof slotProps?.card === "function"
              ? slotProps.card(contact)
              : slotProps?.card)}
          />
        )}
        renderSkeletonItem
        onPageChange={(page) => handleOnParamsChange({ ...params, page })}
        onPageSizeChange={(pageSize) =>
          handleOnParamsChange({ ...params, page: 1, page_size: pageSize })
        }
      />
    </Stack>
  );
};

export default ContactList;
