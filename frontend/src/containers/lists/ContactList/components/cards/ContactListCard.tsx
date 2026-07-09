import Metadata from "@/components/lists/Metadata";
import ListCard, { type IListCardProps } from "@/components/cards/ListCard";
import EmptyChip from "@/components/chips/EmptyChip";
import { ContactIcons } from "@/store/constants/contacts";
import type { TContact } from "@/store/types/contacts";

type TListCardProps = Omit<IListCardProps, "onClick" | "onChange">;

interface IContactListCardProps extends Partial<TListCardProps> {
  contact: TContact;
  onClick?: (
    contact: TContact,
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => void;
}

const ContactListCard: React.FC<IContactListCardProps> = ({
  contact,
  disabled,
  options,
  onClick,
  ...props
}) => {
  return (
    <ListCard
      startContent={<ContactIcons.Detail fontSize="large" color="disabled" />}
      label={`${contact.first_name} ${contact.last_name}`}
      disabled={disabled}
      options={options}
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
      {...(onClick && { onClick: (event) => onClick(contact, event) })}
      {...props}
    />
  );
};

export default ContactListCard;
