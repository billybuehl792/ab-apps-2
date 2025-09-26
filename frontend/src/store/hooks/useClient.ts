import { useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Delete, Edit, Info, Work } from "@mui/icons-material";
import useConfirm from "./useConfirm";
import { clientMutations } from "../mutations/clients";
import { clientQueries } from "../queries/clients";
import type { ClientBasic } from "../types/clients";

enum ClientMenuOptionId {
  detail = "detail",
  edit = "edit",
  createWorkOrder = "createWorkOrder",
  delete = "delete",
}

const useClient = (client: ClientBasic | number) => {
  /** Values */

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const confirm = useConfirm();

  const isId = typeof client === "number";
  const clientId = isId ? client : client.id;

  /** Queries */

  const clientQuery = useQuery({
    ...clientQueries.detail(clientId),
    enabled: isId,
  });

  /** Data */

  const clientData = isId ? clientQuery.data : client;
  const clientFullName = clientData ? clientData.full_name : "Client";

  /** Mutations */

  const deleteClientMutation = useMutation(clientMutations.delete());

  /** Callbacks */

  const handleDeleteClient = () => {
    deleteClientMutation.mutate(clientId, {
      onSuccess: () => {
        queryClient.invalidateQueries(clientQueries.list());
        navigate({ to: "/app/dashboard/clients" });
      },
    });
  };

  /** Options */

  const options: MenuOption<ClientMenuOptionId>[] = [
    {
      id: ClientMenuOptionId.detail,
      label: "Detail",
      Icon: Info,
      onClick: () =>
        navigate({
          to: "/app/dashboard/clients/$id",
          params: { id: String(clientId) },
        }),
    },
    {
      id: ClientMenuOptionId.edit,
      label: "Edit",
      Icon: Edit,
      onClick: () =>
        navigate({
          to: "/app/dashboard/clients/$id",
          params: { id: String(clientId) },
          search: { edit: true },
        }),
    },
    {
      id: ClientMenuOptionId.createWorkOrder,
      label: "Create Work Order",
      Icon: Work,
      onClick: () =>
        navigate({
          to: "/app/dashboard/work-orders/create",
          search: { client: clientId },
        }),
    },
    {
      id: ClientMenuOptionId.delete,
      label: "Delete",
      Icon: Delete,
      color: "error",
      onClick: () => confirm(`Delete ${clientFullName}?`, handleDeleteClient),
    },
  ];

  return { client: clientData, options };
};

export default useClient;
