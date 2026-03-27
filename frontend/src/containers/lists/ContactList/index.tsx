import { type ComponentProps } from "react";
import { Stack } from "@mui/material";
import { Add } from "@mui/icons-material";
import PaginatedList, {
  type IPaginatedListProps,
} from "@/components/lists/PaginatedList";
import CustomLink from "@/components/links/CustomLink";
import ContactListCard from "./components/cards/ContactListCard";
import ContactListOrderingButtonGroup, {
  type IContactListOrderingButtonGroupProps,
} from "./components/buttons/ContactListOrderingButtonGroup";
import ContactListFiltersIconButton, {
  type IContactListFiltersIconButtonProps,
} from "./components/buttons/ContactListFiltersIconButton";
import { ContactIcons } from "@/store/constants/contacts";
import type { TContact, TContactListRequest } from "@/store/types/contacts";

type TPaginatedListProps = IPaginatedListProps<
  TContact,
  TContactListRequest["params"]
>;
type TCardProps = Partial<
  Omit<ComponentProps<typeof ContactListCard>, "contact">
>;

export interface IContactListProps extends Omit<
  TPaginatedListProps,
  "params" | "renderItem" | "onChange" | "slotProps"
> {
  options: TContactListRequest;
  onOrderingChange?: IContactListOrderingButtonGroupProps["onChange"];
  onFiltersChange?: IContactListFiltersIconButtonProps["form"]["onSubmit"];
  onCardChange?: TCardProps["onChange"];
  slotProps?: {
    card?: TCardProps | ((contact: TContact) => TCardProps);
    orderingButtonGroup?: Partial<IContactListOrderingButtonGroupProps>;
    filtersIconButton?: Partial<IContactListFiltersIconButtonProps>;
  } & TPaginatedListProps["slotProps"];
}

const ContactList: React.FC<IContactListProps> = ({
  options,
  total,
  loading,
  error,
  empty,
  onOrderingChange,
  onFiltersChange,
  onCardChange,
  slotProps: { card: cardProps, ...slotProps } = {},
  ...props
}) => {
  return (
    <PaginatedList
      total={total}
      params={options.params}
      loading={loading}
      error={error}
      empty={
        total === 0 || empty === true
          ? {
              label: "No Contacts Found",
              icon: <ContactIcons.List fontSize="large" />,
              ...(options.params.search
                ? { description: `No results for "${options.params.search}".` }
                : {
                    actions: [
                      <CustomLink
                        label="Create"
                        to="/app/dashboard/contacts/create"
                        icon={<Add />}
                      />,
                    ],
                  }),
            }
          : empty
      }
      renderItem={(contact) => (
        <ContactListCard
          key={contact.id}
          contact={contact}
          onChange={onCardChange}
          {...(typeof cardProps === "function"
            ? cardProps(contact)
            : cardProps)}
        />
      )}
      renderSkeletonItem
      slotProps={{
        ...slotProps,
        header: {
          ...((!!onOrderingChange || !!onFiltersChange) && {
            endContent: (
              <Stack direction="row" spacing={1}>
                {!!onOrderingChange && (
                  <ContactListOrderingButtonGroup
                    value={options.params.ordering}
                    onChange={onOrderingChange}
                    {...slotProps?.orderingButtonGroup}
                  />
                )}
                {!!onFiltersChange && (
                  <ContactListFiltersIconButton
                    form={{
                      values: {
                        city: options.params.city ?? [],
                        tag: options.params.tag ?? [],
                      },
                      onSubmit: onFiltersChange,
                    }}
                    {...slotProps?.filtersIconButton}
                  />
                )}
              </Stack>
            ),
          }),
          ...slotProps?.header,
        },
      }}
      {...props}
    />
  );
};

export default ContactList;
