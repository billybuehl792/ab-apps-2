import { type ComponentProps } from "react";
import { useQuery } from "@tanstack/react-query";
import MenuOptionIconButton from "@/components/buttons/MenuOptionIconButton";
import useClient from "@/store/hooks/useClient";
import { clientQueries } from "@/store/queries/clients";
import { ClientOptionId } from "@/store/enums/clients";
import type { ClientBasic } from "@/store/types/clients";

interface ClientMenuOptionIconButtonProps
  extends Omit<ComponentProps<typeof MenuOptionIconButton>, "options"> {
  client: ClientBasic | number;
  hideOptions?: ClientOptionId[];
}

const ClientMenuOptionIconButton = ({
  client: clientProp,
  hideOptions,
  ...props
}: ClientMenuOptionIconButtonProps) => {
  /** Values */

  const { client, options } = useClient(clientProp);

  const isId = typeof clientProp === "number";
  const clientId = isId ? clientProp : clientProp.id;

  /** Queries */

  const clientQuery = useQuery({
    ...clientQueries.detail(clientId),
    enabled: isId && !isNaN(clientId),
  });

  return (
    <MenuOptionIconButton
      title={client?.full_name ?? "Client"}
      disabled={isId && !clientQuery.isSuccess}
      options={options.filter((option) => !hideOptions?.includes(option.id))}
      {...props}
    />
  );
};

export default ClientMenuOptionIconButton;
