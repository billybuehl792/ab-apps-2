import { type ComponentProps } from "react";
import { useMutation } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { Delete, Edit, Info } from "@mui/icons-material";
import useConfirm from "@/store/hooks/useConfirm";
import Metadata from "@/components/lists/Metadata";
import ListCard from "@/components/cards/ListCard";
import { clientEndpoints, ClientIcons } from "@/store/constants/clients";
import { errorUtils } from "@/store/utils/error";
import { EObjectChangeType } from "@/store/enums/api";
import { EClientOptionId } from "@/store/enums/clients";
import type { TClient } from "@/store/types/clients";

interface IClientListCardProps extends Partial<
  Omit<ComponentProps<typeof ListCard>, "options" | "onClick" | "onChange">
> {
  client: TClient;
  options?:
    | IMenuOption[]
    | ((
        client: TClient,
        baseOptions: IMenuOption<EClientOptionId>[],
      ) => IMenuOption[]);
  onClick?: (
    client: TClient,
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => void;
  onChange?: (client: TClient, type: EObjectChangeType) => void;
}

const ClientListCard: React.FC<IClientListCardProps> = ({
  client,
  disabled: disabledProp,
  options: optionsProp,
  onClick,
  onChange,
  ...props
}: IClientListCardProps) => {
  /** Values */

  const confirm = useConfirm();
  const snackbar = useSnackbar();

  const metadataItems: ComponentProps<typeof Metadata>["items"] = [
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
  ];

  /** Mutations */

  const deleteClientMutation = useMutation({
    mutationKey: [
      clientEndpoints.client(client.id).id,
      EObjectChangeType.Delete,
    ],
    mutationFn: () => clientEndpoints.client(client.id).delete(),
  });

  /** Callbacks */

  const handleOnClick: ComponentProps<typeof ListCard>["onClick"] = (event) =>
    onClick?.(client, event);

  const handleDeleteClient = (client: TClient) => {
    confirm(`Delete ${client.full_name}?`, () =>
      deleteClientMutation.mutate(undefined, {
        onSuccess: () => {
          snackbar.enqueueSnackbar(`${client.full_name} deleted`, {
            variant: "success",
          });
          onChange?.(client, EObjectChangeType.Delete);
        },
        onError: (error) =>
          snackbar.enqueueSnackbar(errorUtils.getErrorMessage(error), {
            variant: "error",
          }),
      }),
    );
  };

  /** Data */

  const disabled = disabledProp ?? deleteClientMutation.isPending;
  const changeDisabled = disabled || !onChange;

  /** Options */

  const baseOptions: IMenuOption<EClientOptionId>[] = [
    {
      id: `${client.id}-${EClientOptionId.Detail}`,
      value: EClientOptionId.Detail,
      label: "Detail",
      icon: <Info />,
      disabled: disabled,
      link: {
        to: "/app/dashboard/clients/$id",
        params: { id: String(client.id) },
      },
    },
    {
      id: `${client.id}-${EClientOptionId.Edit}`,
      value: EClientOptionId.Edit,
      label: "Edit",
      icon: <Edit />,
      disabled: disabled,
      link: {
        to: "/app/dashboard/clients/$id",
        params: { id: String(client.id) },
        search: { edit: true },
      },
    },
    {
      id: `${client.id}-${EClientOptionId.Delete}`,
      value: EClientOptionId.Delete,
      label: "Delete",
      icon: <Delete />,
      color: "error.main",
      disabled: changeDisabled,
      onClick: () => handleDeleteClient(client),
    },
  ];

  const options = optionsProp
    ? typeof optionsProp === "function"
      ? optionsProp(client, baseOptions)
      : optionsProp
    : baseOptions;

  return (
    <ListCard
      startContent={<ClientIcons.Detail fontSize="large" color="disabled" />}
      label={client.full_name}
      description={<Metadata items={metadataItems} />}
      link={{
        to: "/app/dashboard/clients/$id",
        params: { id: String(client.id) },
      }}
      disabled={disabled}
      options={options}
      {...(!!onClick && { onClick: handleOnClick })}
      {...props}
    />
  );
};

export default ClientListCard;
