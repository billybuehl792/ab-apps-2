import { useCallback, useMemo } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { Delete, Edit, Info } from "@mui/icons-material";
import useConfirm from "./useConfirm";
import { errorUtils } from "../utils/error";
import { clientEndpoints, getPlaceholderClient } from "../constants/clients";
import { EClientOptionId } from "../enums/clients";
import { EObjectChangeType } from "../enums/api";
import { NULL_ID } from "../constants/api";
import type { TClient, TClientBasic } from "../types/clients";

type TClientMenuOption = IMenuOption<EClientOptionId, EClientOptionId>;

export interface IUseClientOptions {
  disabled?: boolean;
  hideOptions?: EClientOptionId[];
  options?:
    | TClientMenuOption[]
    | ((
        client: TClient,
        baseMenuOptions: TClientMenuOption[],
      ) => TClientMenuOption[]);
  onChange?: (client: TClient, type: EObjectChangeType) => void;
}

export type TUseClient = ReturnType<typeof useClient>;

const useClient = (
  client: TClientBasic | TClientBasic["id"],
  options?: IUseClientOptions,
) => {
  /** Values */

  const snackbar = useSnackbar();
  const confirm = useConfirm();

  const isId = typeof client === "number";
  const clientId = isId ? client : client.id;
  const isNonExistentClient = clientId === NULL_ID;

  /** Queries */

  const clientQuery = useQuery({
    queryKey: clientEndpoints.client(clientId).id,
    queryFn: clientEndpoints.client(clientId).get,
    initialData: getPlaceholderClient({
      id: clientId,
      ...(isId ? {} : client),
    }),
    enabled: isId && !isNonExistentClient,
  });

  /** Mutations */

  const createMutation = useMutation({
    mutationKey: [clientEndpoints.id, EObjectChangeType.Create],
    mutationFn: clientEndpoints.post,
    onSuccess: (res) => {
      options?.onChange?.(res, EObjectChangeType.Create);
      snackbar.enqueueSnackbar(`'${res.full_name}' created successfully`, {
        variant: "success",
      });
    },
    onError: (error) =>
      snackbar.enqueueSnackbar(errorUtils.getErrorMessage(error), {
        variant: "error",
      }),
  });

  const updateMutation = useMutation({
    mutationKey: [
      clientEndpoints.client(clientId).id,
      EObjectChangeType.Update,
    ],
    mutationFn: clientEndpoints.client(clientId).patch,
    onSuccess: (res) => {
      options?.onChange?.(res, EObjectChangeType.Update);
      snackbar.enqueueSnackbar(`'${res.full_name}' updated successfully`, {
        variant: "success",
      });
    },
    onError: (error) =>
      snackbar.enqueueSnackbar(errorUtils.getErrorMessage(error), {
        variant: "error",
      }),
  });

  const deleteMutation = useMutation({
    mutationKey: [
      clientEndpoints.client(clientId).id,
      EObjectChangeType.Delete,
    ],
    mutationFn: clientEndpoints.client(clientId).delete,
    onSuccess: () => {
      options?.onChange?.(clientQuery.data, EObjectChangeType.Delete);
      snackbar.enqueueSnackbar(`${clientQuery.data.full_name} deleted`, {
        variant: "success",
      });
    },
    onError: (error) =>
      snackbar.enqueueSnackbar(errorUtils.getErrorMessage(error), {
        variant: "error",
      }),
  });

  /** Data */

  const isMutating = isNonExistentClient
    ? createMutation.isPending
    : updateMutation.isPending || deleteMutation.isPending;
  const isDisabled =
    options?.disabled ||
    isMutating ||
    (clientQuery.isEnabled && !clientQuery.isSuccess);
  const isChangeDisabled = isDisabled || !options?.onChange;

  /** Callbacks */

  const handleCreate = createMutation.mutate;

  const handleUpdate = updateMutation.mutate;

  const handleDelete = useCallback(
    (...options: Parameters<typeof deleteMutation.mutate>) =>
      confirm(
        {
          title: `Delete ${clientQuery.data.full_name}?`,
          description: `Are you sure you want to delete this client? This operation is irreversible.`,
        },
        () => deleteMutation.mutate(...options),
      ),
    [confirm, deleteMutation],
  );

  /** Options */

  const baseMenuOptions: IMenuOption<EClientOptionId, EClientOptionId>[] =
    useMemo(
      () => [
        {
          id: EClientOptionId.Detail,
          render: !options?.hideOptions?.includes(EClientOptionId.Detail),
          value: EClientOptionId.Detail,
          label: "Detail",
          Icon: Info,
          isDisabled: isDisabled,
          link: {
            to: "/app/dashboard/clients/$id",
            params: { id: String(clientId) },
          },
        },
        {
          id: EClientOptionId.Edit,
          render: !options?.hideOptions?.includes(EClientOptionId.Edit),
          value: EClientOptionId.Edit,
          label: "Edit",
          Icon: Edit,
          isDisabled: isDisabled,
          link: {
            to: "/app/dashboard/clients/$id/edit",
            params: { id: String(clientId) },
          },
        },
        {
          id: EClientOptionId.Delete,
          render: !options?.hideOptions?.includes(EClientOptionId.Delete),
          value: EClientOptionId.Delete,
          label: "Delete",
          Icon: Delete,
          color: "error.main",
          isDisabled: isChangeDisabled,
          onClick: handleDelete,
        },
      ],
      [isDisabled, isChangeDisabled, handleDelete, options],
    );

  const menuOptions = useMemo(
    () =>
      options?.options
        ? typeof options.options === "function"
          ? options.options(clientQuery.data, baseMenuOptions)
          : options.options
        : baseMenuOptions,
    [clientQuery.data, options?.options, baseMenuOptions],
  );

  return {
    client: clientQuery.data,
    options: menuOptions,
    disabled: isDisabled,
    isLoading: clientQuery.isLoading,
    isMutating: isMutating,
    queries: { client: clientQuery },
    mutations: {
      create: createMutation,
      update: updateMutation,
      delete: deleteMutation,
    },
    create: handleCreate,
    update: handleUpdate,
    delete: handleDelete,
  };
};

export default useClient;
