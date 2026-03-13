import useClient, {
  type IUseClientOptions,
  type TUseClient,
} from "@/store/hooks/useClient";
import MenuOptionIconButton, {
  type IMenuOptionIconButtonProps,
} from "@/components/buttons/MenuOptionIconButton";
import type { TClientBasic } from "@/store/types/clients";

type TMenuOptionIconButtonProps = Omit<
  IMenuOptionIconButtonProps<TUseClient["options"]>,
  "options"
>;

interface IClientMenuOptionIconButtonProps
  extends TMenuOptionIconButtonProps, IUseClientOptions {
  client: TWithRequired<TClientBasic, "id">;
}

const ClientMenuOptionIconButton: React.FC<
  IClientMenuOptionIconButtonProps
> = ({ client, options, hideOptions, disabled, onChange, ...props }) => {
  /** Values */

  const clientHook = useClient(client, {
    disabled,
    options,
    hideOptions,
    onChange,
  });

  return (
    <MenuOptionIconButton
      title={clientHook.client.full_name}
      disabled={clientHook.disabled}
      loading={clientHook.isLoading}
      options={clientHook.options}
      {...props}
    />
  );
};

export default ClientMenuOptionIconButton;
