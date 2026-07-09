import useContact, {
  type IUseContactOptions,
  type TUseContact,
} from "@/store/hooks/useContact";
import MenuOptionIconButton, {
  type IMenuOptionIconButtonProps,
} from "@/components/buttons/MenuOptionIconButton";
import type { TContact } from "@/store/types/contacts";

type TMenuOptionIconButtonProps = Omit<
  IMenuOptionIconButtonProps<TUseContact["options"]>,
  "options"
>;

export interface IContactMenuOptionIconButtonProps
  extends TMenuOptionIconButtonProps, IUseContactOptions {
  contact: TContact;
}

const ContactMenuOptionIconButton: React.FC<
  IContactMenuOptionIconButtonProps
> = ({ contact, options, hideOptions, disabled, onChange, ...props }) => {
  /** Values */

  const contactHook = useContact(contact, {
    disabled,
    options,
    hideOptions,
    onChange,
  });

  return (
    <MenuOptionIconButton
      title={`${contactHook.contact.first_name} ${contactHook.contact.last_name}`}
      disabled={contactHook.disabled}
      options={contactHook.options}
      {...props}
    />
  );
};

export default ContactMenuOptionIconButton;
