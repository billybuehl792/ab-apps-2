import { useCallback, useMemo } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { Delete, Edit, Info } from "@mui/icons-material";
import useConfirm from "./useConfirm";
import { errorUtils } from "../utils/error";
import { getPlaceholderPlace, placeEndpoints } from "../constants/places";
import { EObjectChangeType } from "../enums/api";
import { EPlaceOptionId } from "../enums/places";
import { NULL_ID } from "../constants/api";
import type { TPlaceBasic } from "../types/places";

type TPlaceMenuOption = IMenuOption<EPlaceOptionId, EPlaceOptionId>;

export interface IUsePlaceOptions {
  disabled?: boolean;
  hideOptions?: EPlaceOptionId[];
  options?:
    | TPlaceMenuOption[]
    | ((
        place: TPlaceBasic,
        baseMenuOptions: TPlaceMenuOption[],
      ) => TPlaceMenuOption[]);
  onChange?: (place: TPlaceBasic, type: EObjectChangeType) => void;
}

export type TUsePlace = ReturnType<typeof usePlace>;

const usePlace = (
  place: TPlaceBasic | TPlaceBasic["id"],
  options?: IUsePlaceOptions,
) => {
  /** Values */

  const snackbar = useSnackbar();
  const confirm = useConfirm();

  const isId = typeof place === "number";
  const placeId = isId ? place : place.id;
  const isNonExistentPlace = placeId === NULL_ID;

  /** Queries */

  const placeQuery = useQuery({
    queryKey: placeEndpoints.place(placeId).id,
    queryFn: placeEndpoints.place(placeId).get,
    initialData: getPlaceholderPlace({
      id: placeId,
      ...(isId ? {} : place),
    }),
    enabled: isId && !isNonExistentPlace,
  });

  /** Mutations */

  const createMutation = useMutation({
    mutationKey: [placeEndpoints.id, EObjectChangeType.Create],
    mutationFn: placeEndpoints.post,
    onSuccess: (res) => {
      options?.onChange?.(res, EObjectChangeType.Create);
      snackbar.enqueueSnackbar(`'${res.address_short}' created successfully`, {
        variant: "success",
      });
    },
    onError: (error) =>
      snackbar.enqueueSnackbar(errorUtils.getErrorMessage(error), {
        variant: "error",
      }),
  });

  const updateMutation = useMutation({
    mutationKey: [placeEndpoints.place(placeId).id, EObjectChangeType.Update],
    mutationFn: placeEndpoints.place(placeId).patch,
    onSuccess: (res) => {
      options?.onChange?.(res, EObjectChangeType.Update);
      snackbar.enqueueSnackbar(`'${res.address_short}' updated successfully`, {
        variant: "success",
      });
    },
    onError: (error) =>
      snackbar.enqueueSnackbar(errorUtils.getErrorMessage(error), {
        variant: "error",
      }),
  });

  const deleteMutation = useMutation({
    mutationKey: [placeEndpoints.place(placeId).id, EObjectChangeType.Delete],
    mutationFn: placeEndpoints.place(placeId).delete,
    onSuccess: () => {
      options?.onChange?.(placeQuery.data, EObjectChangeType.Delete);
      snackbar.enqueueSnackbar(`${placeQuery.data.address_short} deleted`, {
        variant: "success",
      });
    },
    onError: (error) =>
      snackbar.enqueueSnackbar(errorUtils.getErrorMessage(error), {
        variant: "error",
      }),
  });

  /** Data */

  const isMutating = isNonExistentPlace
    ? createMutation.isPending
    : updateMutation.isPending || deleteMutation.isPending;
  const isDisabled =
    options?.disabled ||
    isMutating ||
    (placeQuery.isEnabled && !placeQuery.isSuccess);
  const isChangeDisabled = isDisabled || !options?.onChange;

  /** Callbacks */

  const handleCreate = createMutation.mutate;

  const handleUpdate = updateMutation.mutate;

  const handleDelete = useCallback(
    (...options: Parameters<typeof deleteMutation.mutate>) =>
      confirm(
        {
          title: `Delete ${placeQuery.data.address_short}?`,
          description: `Are you sure you want to delete this place? This operation is irreversible.`,
        },
        () => deleteMutation.mutate(...options),
      ),
    [confirm, deleteMutation],
  );

  /** Options */

  const baseMenuOptions: IMenuOption<EPlaceOptionId, EPlaceOptionId>[] =
    useMemo(
      () => [
        {
          id: EPlaceOptionId.Detail,
          render: !options?.hideOptions?.includes(EPlaceOptionId.Detail),
          value: EPlaceOptionId.Detail,
          label: "Detail",
          Icon: Info,
          isDisabled: isDisabled,
          link: {
            to: "/app/directory/places/$id",
            params: { id: String(placeId) },
          },
        },
        {
          id: EPlaceOptionId.Edit,
          render: !options?.hideOptions?.includes(EPlaceOptionId.Edit),
          value: EPlaceOptionId.Edit,
          label: "Edit",
          Icon: Edit,
          isDisabled: isDisabled,
          link: {
            to: "/app/directory/places/$id/edit",
            params: { id: String(placeId) },
          },
        },
        {
          id: EPlaceOptionId.Delete,
          render: !options?.hideOptions?.includes(EPlaceOptionId.Delete),
          value: EPlaceOptionId.Delete,
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
          ? options.options(placeQuery.data, baseMenuOptions)
          : options.options
        : baseMenuOptions,
    [placeQuery.data, options?.options, baseMenuOptions],
  );

  return {
    place: placeQuery.data,
    options: menuOptions,
    disabled: isDisabled,
    isLoading: placeQuery.isLoading,
    isMutating: isMutating,
    queries: { place: placeQuery },
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

export default usePlace;
