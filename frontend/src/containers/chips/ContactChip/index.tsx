import { Chip, type ChipProps } from "@mui/material";
import { ContactIcons } from "@/store/constants/contacts";
import type { TContact } from "@/store/types/contacts";

interface IContactChipProps extends ChipProps {
  contact: TContact;
}

const ContactChip = ({ contact, ...props }: IContactChipProps) => {
  return (
    <Chip
      icon={<ContactIcons.Detail />}
      label={`${contact.first_name} ${contact.last_name}`}
      {...props}
    />
  );
};

export default ContactChip;
