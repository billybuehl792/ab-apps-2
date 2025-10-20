import { useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Delete, Edit, Info, Work } from "@mui/icons-material";
import useConfirm from "./useConfirm";
import { clientMutations } from "../mutations/clients";
import { clientQueries } from "../queries/clients";
import { ClientOptionId } from "../enums/clients";
import type { ClientBasic } from "../types/clients";

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
    enabled: isId && !isNaN(clientId),
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

  const options: MenuOption<ClientOptionId>[] = [
    {
      id: ClientOptionId.Detail,
      label: "Detail",
      Icon: Info,
      onClick: () =>
        navigate({
          to: "/app/dashboard/clients/$id",
          params: { id: String(clientId) },
        }),
    },
    {
      id: ClientOptionId.Edit,
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
      id: ClientOptionId.Delete,
      label: "Delete",
      Icon: Delete,
      color: "error",
      onClick: () => confirm(`Delete ${clientFullName}?`, handleDeleteClient),
    },
  ];

  return { client: clientData, options };
};

export default useClient;
