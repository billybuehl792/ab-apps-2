import { useCallback, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { Delete, Info } from "@mui/icons-material";
import useConfirm from "./useConfirm";
import { errorUtils } from "../utils/error";
import placeEndpoints from "../endpoints/places";
import { EObjectChangeType } from "../enums/api";
import { EPlaceOptionId } from "../enums/places";
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

const usePlace = (place: TPlaceBasic, options?: IUsePlaceOptions) => {
  /** Values */

  const navigate = useNavigate();
  const snackbar = useSnackbar();
  const confirm = useConfirm();

  /** Mutations */

  const deleteMutation = useMutation({
    mutationKey: [placeEndpoints.place(place.id).id, EObjectChangeType.Delete],
    mutationFn: placeEndpoints.place(place.id).delete,
    onSuccess: () => {
      options?.onChange?.(place, EObjectChangeType.Delete);
      snackbar.enqueueSnackbar(`${place.address_short} deleted`, {
        variant: "success",
      });
    },
    onError: (error) =>
      snackbar.enqueueSnackbar(errorUtils.getErrorMessage(error), {
        variant: "error",
      }),
  });

  /** Data */

  const isMutating = deleteMutation.isPending;
  const isDisabled = options?.disabled || isMutating;
  const isChangeDisabled = isDisabled || !options?.onChange;

  /** Callbacks */

  const handleView = () =>
    navigate({ to: "/app/places/$id", params: { id: String(place.id) } });

  const handleDelete = useCallback(
    (...options: Parameters<typeof deleteMutation.mutate>) =>
      confirm(
        {
          title: `Delete ${place.address_short}?`,
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
            to: "/app/places/$id",
            params: { id: String(place.id) },
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
          ? options.options(place, baseMenuOptions)
          : options.options
        : baseMenuOptions,
    [place, options?.options, baseMenuOptions],
  );

  return {
    place: place,
    options: menuOptions,
    disabled: isDisabled,
    isMutating: isMutating,
    mutations: { delete: deleteMutation },
    delete: handleDelete,
    view: handleView,
  };
};

export default usePlace;
