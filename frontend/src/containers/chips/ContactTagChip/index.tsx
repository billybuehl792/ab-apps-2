import { Chip, Skeleton, type ChipProps } from "@mui/material";
import useContactTag from "@/store/hooks/useContactTag";
import { ContactTagIcons } from "@/store/constants/contacts";
import type { IUseContactTagOptions } from "@/store/hooks/useContactTag";
import type { TContactTag } from "@/store/types/contacts";

interface ContactTagChipProps extends ChipProps {
  contactTag: TContactTag | TContactTag["id"];
  options?: IUseContactTagOptions;
}

const ContactTagChip = ({
  contactTag,
  options,
  ...props
}: ContactTagChipProps) => {
  /** Values */

  const contactTagHook = useContactTag(contactTag, options);

  return (
    <Chip
      icon={<ContactTagIcons.Detail fontSize={props.size} />}
      label={
        contactTagHook.isLoading ? (
          <Skeleton height={24} width={100} />
        ) : (
          contactTagHook.contactTag.label
        )
      }
      {...props}
    />
  );
};

export default ContactTagChip;
