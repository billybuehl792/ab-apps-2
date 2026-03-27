import { Stack } from "@mui/material";
import useContact, { type IUseContactOptions } from "@/store/hooks/useContact";
import Metadata from "@/components/lists/Metadata";
import ListCard, { type IListCardProps } from "@/components/cards/ListCard";
import ContactTagChip from "@/containers/chips/ContactTagChip";
import { ContactIcons } from "@/store/constants/contacts";
import type { TContact } from "@/store/types/contacts";

type TListCardProps = Omit<IListCardProps, "options" | "onClick" | "onChange">;

interface IContactListCardProps
  extends Partial<TListCardProps>, IUseContactOptions {
  contact: TContact;
  onClick?: (
    contact: TContact,
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => void;
}

const ContactListCard: React.FC<IContactListCardProps> = ({
  contact,
  hideOptions,
  disabled,
  options,
  onClick,
  onChange,
  ...props
}) => {
  /** Values */

  const contactHook = useContact(contact, {
    options,
    disabled,
    hideOptions,
    onChange,
  });

  return (
    <ListCard
      startContent={<ContactIcons.Detail fontSize="large" color="disabled" />}
      label={`${contact.first_name} ${contact.last_name}`}
      description={
        <Metadata
          items={[
            {
              id: "email",
              label: "Email",
              value: contact.email ?? "None",
            },
            {
              id: "address",
              label: "Address",
              value: contact.place?.address_short ?? "None",
            },
            {
              id: "tags",
              label: "Tags",
              render: Boolean(contact.tags?.length),
              value: (
                <Stack direction="row" spacing={1}>
                  {contact.tags.map((tag) => (
                    <ContactTagChip key={tag.id} contactTag={tag} size="xxs" />
                  ))}
                </Stack>
              ),
            },
          ]}
        />
      }
      link={{
        to: "/app/dashboard/contacts/$id",
        params: { id: String(contact.id) },
      }}
      disabled={contactHook.disabled}
      options={contactHook.options}
      {...(onClick && { onClick: (event) => onClick(contact, event) })}
      {...props}
    />
  );
};

export default ContactListCard;
