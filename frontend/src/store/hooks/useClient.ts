import { useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useSnackbar } from "notistack";
import { useMutation, useQuery } from "@tanstack/react-query";
// import { Delete, Edit, Info } from "@mui/icons-material";
import { EClientOptionId } from "../enums/clients";
import useConfirm from "./useConfirm";
import { errorUtils } from "../utils/error";
import type { TClientBasic } from "../types/clients";
import { clientEndpoints, getPlaceholderClient } from "../constants/clients";
import { EObjectChangeType } from "../enums/api";

const useClient = (
  client: number | TClientBasic,
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
    queryKey: clientEndpoints.client(clientId).id,
    queryFn: clientEndpoints.client(clientId).get,
    enabled: isId && Boolean(clientId),
  });

  /** Mutations */

  const deleteClientMutation = useMutation({
    mutationKey: [
      clientEndpoints.client(clientId).id,
      EObjectChangeType.Delete,
    ],
    mutationFn: clientEndpoints.client(clientId).delete,
  });

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
        deleteClientMutation.mutate(undefined, {
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

  const menuOptions: IMenuOption<EClientOptionId>[] = [
    {
      id: EClientOptionId.Detail,
      value: EClientOptionId.Detail,
      label: "Detail",
      disabled: disabled,
      onClick: handleNavigateView,
    },
    {
      id: EClientOptionId.Edit,
      value: EClientOptionId.Edit,
      label: "Edit",
      disabled,
      onClick: handleNavigateEdit,
    },
    {
      id: EClientOptionId.Delete,
      value: EClientOptionId.Delete,
      label: "Delete",
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
