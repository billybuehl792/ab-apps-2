import { type ComponentProps } from "react";
import MenuOptionIconButton from "@/components/buttons/MenuOptionIconButton";
import useClient from "@/store/hooks/useClient";
import type { ClientBasic } from "@/store/types/clients";

interface ClientMenuOptionIconButtonProps
  extends Omit<ComponentProps<typeof MenuOptionIconButton>, "options"> {
  client: ClientBasic | number;
  renderOptions?: (
    options: ReturnType<typeof useClient>["options"]
  ) => MenuOption[];
}

const ClientMenuOptionIconButton = ({
  client: clientProp,
  renderOptions,
  ...props
}: ClientMenuOptionIconButtonProps) => {
  /** Values */

  const { client, options } = useClient(clientProp);

  return (
    <MenuOptionIconButton
      title={client?.full_name ?? "Client"}
      options={renderOptions?.(options) ?? options}
      {...props}
    />
  );
};

export default ClientMenuOptionIconButton;
