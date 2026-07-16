import { useCallback, useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { Delete } from "@mui/icons-material";
import useConfirm from "./useConfirm";
import { documentMutations } from "../mutations/documents";
import { errorUtils } from "../utils/error";
import { markdownUtils } from "../utils/markdown";
import { EDocumentOptionId } from "../enums/documents";
import { EObjectChangeType } from "../enums/api";
import type { TDocument } from "../types/documents";

export interface IUseDocumentOptions {
  disabled?: boolean;
  hideOptions?: EDocumentOptionId[];
  options?:
    | IMenuOption[]
    | ((document: TDocument, baseMenuOptions: IMenuOption[]) => IMenuOption[]);
  onChange?: (document: TDocument, type: EObjectChangeType) => void;
}

export type TUseDocument = ReturnType<typeof useDocument>;

const useDocument = (document: TDocument, options?: IUseDocumentOptions) => {
  /** Values */

  const snackbar = useSnackbar();
  const confirm = useConfirm();

  /** Mutations */

  const updateMutation = useMutation({
    ...documentMutations.document(document.id).update,
    onSuccess: (res) => {
      options?.onChange?.(res, EObjectChangeType.Update);
      snackbar.enqueueSnackbar(
        `${markdownUtils.bold(res.label)} updated successfully`,
        { variant: "success" },
      );
    },
    onError: (error) =>
      snackbar.enqueueSnackbar(errorUtils.getErrorMessage(error), {
        variant: "error",
      }),
  });

  const deleteMutation = useMutation({
    ...documentMutations.document(document.id).delete,
    onSuccess: () => {
      options?.onChange?.(document, EObjectChangeType.Delete);
      snackbar.enqueueSnackbar(
        `${markdownUtils.bold(document.label)} deleted`,
        { variant: "success" },
      );
    },
    onError: (error) =>
      snackbar.enqueueSnackbar(errorUtils.getErrorMessage(error), {
        variant: "error",
      }),
  });

  /** Data */

  const isMutating = updateMutation.isPending || deleteMutation.isPending;
  const isDisabled = options?.disabled || isMutating;
  const isChangeDisabled = isDisabled || !options?.onChange;

  /** Callbacks */

  const handleUpdate = updateMutation.mutate;

  const handleDelete = useCallback(
    (...options: Parameters<typeof deleteMutation.mutate>) =>
      confirm(
        {
          title: `Delete ${document.label}?`,
          description: `Are you sure you want to delete this document? This operation is irreversible.`,
        },
        () => deleteMutation.mutate(...options),
      ),
    [confirm, deleteMutation, document.label],
  );

  /** Options */

  const baseMenuOptions: IMenuOption[] = useMemo(
    () => [
      {
        id: EDocumentOptionId.Delete,
        render: !options?.hideOptions?.includes(EDocumentOptionId.Delete),
        value: EDocumentOptionId.Delete,
        label: "Delete",
        Icon: Delete,
        color: "error.main",
        isDisabled: isChangeDisabled,
        onClick: handleDelete,
      },
    ],
    [options?.hideOptions, isChangeDisabled, handleDelete],
  );

  const menuOptions = useMemo(
    () =>
      options?.options
        ? typeof options.options === "function"
          ? options.options(document, baseMenuOptions)
          : options.options
        : baseMenuOptions,
    [options, document, baseMenuOptions],
  );

  return {
    document,
    options: menuOptions,
    disabled: isDisabled,
    isMutating: isMutating,
    mutations: { update: updateMutation, delete: deleteMutation },
    update: handleUpdate,
    delete: handleDelete,
  };
};

export default useDocument;
