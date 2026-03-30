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

interface IContactMenuOptionIconButtonProps
  extends TMenuOptionIconButtonProps, IUseContactOptions {
  contact: TContact | TContact["id"];
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
      loading={contactHook.isLoading}
      options={contactHook.options}
      {...props}
    />
  );
};

export default ContactMenuOptionIconButton;
