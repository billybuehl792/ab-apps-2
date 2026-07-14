import { useCallback, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { Delete, Info } from "@mui/icons-material";
import useConfirm from "./useConfirm";
import { errorUtils } from "../utils/error";
import { placeMutations } from "../mutations/places";
import { EObjectChangeType } from "../enums/api";
import { EPlaceOptionId } from "../enums/places";
import type { TPlace } from "../types/places";

type TPlaceMenuOption = IMenuOption<EPlaceOptionId, EPlaceOptionId>;

export interface IUsePlaceOptions {
  disabled?: boolean;
  hideOptions?: EPlaceOptionId[];
  options?:
    | TPlaceMenuOption[]
    | ((
        place: TPlace,
        baseMenuOptions: TPlaceMenuOption[],
      ) => TPlaceMenuOption[]);
  onChange?: (place: TPlace, type: EObjectChangeType) => void;
}

export type TUsePlace = ReturnType<typeof usePlace>;

const usePlace = (place: TPlace, options?: IUsePlaceOptions) => {
  /** Values */

  const navigate = useNavigate();
  const snackbar = useSnackbar();
  const confirm = useConfirm();

  /** Mutations */

  const deleteMutation = useMutation({
    ...placeMutations.delete,
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
    navigate({ to: "/app/places/$id", params: { id: place.id } });

  const handleDelete = useCallback(
    (...options: Parameters<typeof deleteMutation.mutate>) =>
      confirm(
        {
          title: `Delete ${place.address_short}?`,
          description: `Are you sure you want to delete this place? This operation is irreversible.`,
        },
        () => deleteMutation.mutate(...options),
      ),
    [confirm, deleteMutation, place.address_short],
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
          link: { to: "/app/places/$id", params: { id: place.id } },
        },
        {
          id: EPlaceOptionId.Delete,
          render: !options?.hideOptions?.includes(EPlaceOptionId.Delete),
          value: EPlaceOptionId.Delete,
          label: "Delete",
          Icon: Delete,
          color: "error.main",
          isDisabled: isChangeDisabled,
          onClick: () => handleDelete(place.id),
        },
      ],
      [
        options?.hideOptions,
        isDisabled,
        place.id,
        isChangeDisabled,
        handleDelete,
      ],
    );

  const menuOptions = useMemo(
    () =>
      options?.options
        ? typeof options.options === "function"
          ? options.options(place, baseMenuOptions)
          : options.options
        : baseMenuOptions,
    [options, place, baseMenuOptions],
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
