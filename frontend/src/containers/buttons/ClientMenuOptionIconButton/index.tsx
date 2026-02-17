import { type ComponentProps } from "react";
import MenuOptionIconButton from "@/components/buttons/MenuOptionIconButton";
import useClient from "@/store/hooks/useClient";
import type { ClientBasic } from "@/store/types/clients";

interface ClientMenuOptionIconButtonProps extends Partial<
  Omit<
    ComponentProps<
      typeof MenuOptionIconButton<ReturnType<typeof useClient>["options"]>
    >,
    "onChange"
  >
> {
  client: ClientBasic | number;
  onChange?: NonNullable<Parameters<typeof useClient>[1]>["onChange"];
}

const ClientMenuOptionIconButton = ({
  client: clientProp,
  options: optionsProp,
  onChange,
  ...props
}: ClientMenuOptionIconButtonProps) => {
  /** Values */

  const { clientQuery, client, options } = useClient(clientProp, { onChange });

  return (
    <MenuOptionIconButton
      title={client.full_name}
      disabled={clientQuery.isEnabled && !clientQuery.isSuccess}
      options={options}
      {...props}
    />
  );
};

export default ClientMenuOptionIconButton;
