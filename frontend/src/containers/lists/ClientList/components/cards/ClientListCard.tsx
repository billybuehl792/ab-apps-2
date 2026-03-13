import useClient, { type IUseClientOptions } from "@/store/hooks/useClient";
import Metadata from "@/components/lists/Metadata";
import ListCard, { type IListCardProps } from "@/components/cards/ListCard";
import { ClientIcons } from "@/store/constants/clients";
import type { TClient } from "@/store/types/clients";

type TListCardProps = Omit<IListCardProps, "options" | "onClick" | "onChange">;

interface IClientListCardProps
  extends Partial<TListCardProps>, IUseClientOptions {
  client: TClient;
  onClick?: (
    client: TClient,
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => void;
}

const ClientListCard: React.FC<IClientListCardProps> = ({
  client,
  hideOptions,
  disabled,
  options,
  onClick,
  onChange,
  ...props
}) => {
  /** Values */

  const clientHook = useClient(client, {
    options,
    disabled,
    hideOptions,
    onChange,
  });

  return (
    <ListCard
      startContent={<ClientIcons.Detail fontSize="large" color="disabled" />}
      label={client.full_name}
      description={
        <Metadata
          items={[
            {
              id: "email",
              label: "Email",
              value: client.email ?? "None",
            },
            {
              id: "address",
              label: "Address",
              value: client.place?.address_short ?? "None",
            },
            {
              id: "workOrders",
              label: "Work Orders",
              render: Boolean(client.work_orders_count),
              value: String(client.work_orders_count),
            },
          ]}
        />
      }
      link={{
        to: "/app/dashboard/clients/$id",
        params: { id: String(client.id) },
      }}
      disabled={clientHook.disabled}
      options={clientHook.options}
      {...(onClick && { onClick: (event) => onClick(client, event) })}
      {...props}
    />
  );
};

export default ClientListCard;
