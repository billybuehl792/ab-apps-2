import { useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useSnackbar } from "notistack";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Delete, Edit, Info } from "@mui/icons-material";
import { clientQueries } from "../queries/clients";
import { clientMutations } from "../mutations/clients";
import { EClientOptionId } from "../enums/clients";
import useConfirm from "./useConfirm";
import { errorUtils } from "../utils/error";
import type { ClientBasic } from "../types/clients";
import { getPlaceholderClient } from "../constants/clients";
import { EObjectChangeType } from "../enums/api";

const useClient = (
  client: number | ClientBasic,
  options?: { onChange?: (clientId: number, type: EObjectChangeType) => void },
) => {
  /** Values */

  const navigate = useNavigate();
  const confirm = useConfirm();
  const snackbar = useSnackbar();

  const isId = typeof client === "number";
  const clientId = typeof client === "number" ? client : client.id;
  const clientFullName =
    typeof client === "number" ? String(client) : client.full_name;

  /** Queries */

  const clientQuery = useQuery({
    ...clientQueries.detail(clientId),
    enabled: isId && Boolean(clientId),
  });

  /** Mutations */

  const deleteClientMutation = useMutation(clientMutations.delete());

  /** Data */

  const disabled =
    (clientQuery.isEnabled && !clientQuery.isSuccess) ||
    deleteClientMutation.isPending;

  /** Callbacks */

  const handleNavigateView = useCallback(
    () =>
      navigate({
        to: "/app/dashboard/clients/$id",
        params: { id: String(clientId) },
      }),
    [clientId, navigate],
  );

  const handleNavigateEdit = useCallback(
    () =>
      navigate({
        to: "/app/dashboard/clients/$id",
        params: { id: String(clientId) },
        search: { edit: true },
      }),
    [clientId, navigate],
  );

  const handleDelete = useCallback(
    () =>
      confirm(`Delete ${clientFullName}?`, () =>
        deleteClientMutation.mutate(clientId, {
          onSuccess: () => {
            options?.onChange?.(clientId, EObjectChangeType.Delete);
            snackbar.enqueueSnackbar(`${clientFullName} deleted`, {
              variant: "success",
            });
          },
          onError: (error) =>
            snackbar.enqueueSnackbar(errorUtils.getErrorMessage(error), {
              variant: "error",
            }),
        }),
      ),
    [
      confirm,
      clientFullName,
      deleteClientMutation,
      clientId,
      options,
      snackbar,
    ],
  );

  /** Options */

  const menuOptions: MenuOption<EClientOptionId, null>[] = [
    {
      id: EClientOptionId.Detail,
      label: "Detail",
      Icon: Info,
      disabled: disabled,
      onClick: handleNavigateView,
    },
    {
      id: EClientOptionId.Edit,
      label: "Edit",
      Icon: Edit,
      disabled,
      onClick: handleNavigateEdit,
    },
    {
      id: EClientOptionId.Delete,
      label: "Delete",
      Icon: Delete,
      color: "error",
      disabled,
      onClick: handleDelete,
    },
  ];

  return {
    clientQuery,
    client: {
      ...getPlaceholderClient(clientId),
      ...(isId ? clientQuery.data : client),
    },
    options: menuOptions,
    disabled,
    view: handleNavigateView,
    edit: handleNavigateEdit,
    delete: handleDelete,
  };
};

export default useClient;
