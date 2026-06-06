import { Stack } from "@mui/material";
import useContact, { type IUseContactOptions } from "@/store/hooks/useContact";
import Metadata from "@/components/lists/Metadata";
import ListCard, { type IListCardProps } from "@/components/cards/ListCard";
import ContactTagChip from "@/containers/chips/ContactTagChip";
import EmptyChip from "@/components/chips/EmptyChip";
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
              value: contact.email || <EmptyChip size="xxs" />,
            },
            {
              id: "phone",
              label: "Phone",
              value: contact.phone_primary || <EmptyChip size="xxs" />,
            },
            {
              id: "address",
              label: "Address",
              value: contact.place?.address_short || <EmptyChip size="xxs" />,
            },
          ]}
        />
      }
      link={{ to: "/app/contacts/$id", params: { id: String(contact.id) } }}
      disabled={contactHook.disabled}
      options={contactHook.options}
      {...(onClick && { onClick: (event) => onClick(contact, event) })}
      {...props}
    />
  );
};

export default ContactListCard;
