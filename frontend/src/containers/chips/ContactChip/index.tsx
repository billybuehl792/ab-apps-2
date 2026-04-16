import { Chip, Skeleton, type ChipProps } from "@mui/material";
import useContact from "@/store/hooks/useContact";
import { ContactIcons } from "@/store/constants/contacts";
import type { IUseContactOptions, TUseContact } from "@/store/hooks/useContact";
import type { TContact } from "@/store/types/contacts";

interface IContactChipProps extends Omit<ChipProps, "onClick"> {
  contact: TContact | TContact["id"];
  options?: IUseContactOptions;
  onClick?: (contactHook: TUseContact) => void;
}

const ContactChip = ({
  contact,
  options,
  onClick,
  ...props
}: IContactChipProps) => {
  /** Values */

  const contactHook = useContact(contact, options);
  const contactFullName = `${contactHook.contact.first_name} ${contactHook.contact?.last_name}`;

  return (
    <Chip
      icon={<ContactIcons.Detail fontSize={props.size} />}
      label={
        contactHook.isLoading ? (
          <Skeleton height={24} width={100} />
        ) : (
          contactFullName
        )
      }
      {...(props?.clickable !== false
        ? {
            onClick: !!onClick
              ? () => onClick(contactHook)
              : () => contactHook.view(),
          }
        : {})}
      {...props}
    />
  );
};

export default ContactChip;
