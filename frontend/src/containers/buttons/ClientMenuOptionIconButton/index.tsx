import { type ComponentProps } from "react";
import { useMatches, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Delete, Edit, Info, Work } from "@mui/icons-material";
import { clientQueries } from "@/store/queries/clients";
import { clientMutations } from "@/store/mutations/clients";
import useConfirm from "@/store/hooks/useConfirm";
import MenuOptionIconButton from "@/components/buttons/MenuOptionIconButton";
import type { Client } from "@/store/types/clients";

interface ClientMenuOptionIconButtonProps
  extends Omit<ComponentProps<typeof MenuOptionIconButton>, "options"> {
  client: Client | Client["id"];
}

const ClientMenuOptionIconButton = ({
  client: clientProp,
  ...props
}: ClientMenuOptionIconButtonProps) => {
  /** Values */

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const confirm = useConfirm();
  const matches = useMatches();

  const isId = !(clientProp instanceof Object);
  const clientId = isId ? clientProp : clientProp.id;

  const isDetail = matches.some((m) => m.routeId === "/app/clients/$id");

  /** Queries */

  const clientDetailQuery = useQuery({
    ...clientQueries.detail(clientId),
    enabled: isId,
  });

  /** Mutations */

  const deleteClientMutation = useMutation(clientMutations.delete());

  /** Data */

  const client = isId ? clientDetailQuery.data : clientProp;
  const clientFullName = client
    ? `${client.first_name} ${client.last_name}`
    : "Client";

  /** Callbacks */

  const handleDeleteClient = () => {
    deleteClientMutation.mutate(clientId, {
      onSuccess: () => {
        queryClient.invalidateQueries(clientQueries.list());
        navigate({ to: "/app/clients" });
      },
    });
  };

  /** Options */

  const options: MenuOption[] = [
    {
      id: "detail",
      render: !isDetail,
      label: "Detail",
      icon: <Info />,
      onClick: () =>
        navigate({ to: "/app/clients/$id", params: { id: String(clientId) } }),
    },
    {
      id: "edit",
      label: "Edit",
      icon: <Edit />,
      onClick: () =>
        navigate({
          to: "/app/clients/$id",
          params: { id: String(clientId) },
          search: { edit: true },
        }),
    },
    {
      id: "createWorkOrder",
      label: "Create Work Order",
      icon: <Work />,
      onClick: () =>
        navigate({
          to: "/app/work-orders/create",
          search: { client: clientId },
        }),
    },
    {
      id: "delete",
      label: "Delete",
      icon: <Delete />,
      color: "error",
      onClick: () => confirm(`Delete ${clientFullName}?`, handleDeleteClient),
    },
  ];

  return (
    <MenuOptionIconButton title={clientFullName} options={options} {...props} />
  );
};

export default ClientMenuOptionIconButton;
