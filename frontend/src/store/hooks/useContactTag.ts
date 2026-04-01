import { useCallback, useMemo } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { Delete } from "@mui/icons-material";
import useConfirm from "./useConfirm";
import { errorUtils } from "../utils/error";
import {
  contactEndpoints,
  getPlaceholderContactTag,
} from "../constants/contacts";
import { EContactTagOptionId } from "../enums/contacts";
import { EObjectChangeType } from "../enums/api";
import { NULL_ID } from "../constants/api";
import { markdownUtils } from "../utils/markdown";
import type { TContactTag } from "../types/contacts";

type TContactTagMenuOption = IMenuOption<
  EContactTagOptionId,
  EContactTagOptionId
>;

export interface IUseContactTagOptions {
  disabled?: boolean;
  hideOptions?: EContactTagOptionId[];
  options?:
    | TContactTagMenuOption[]
    | ((
        contact: TContactTag,
        baseMenuOptions: TContactTagMenuOption[],
      ) => TContactTagMenuOption[]);
  onChange?: (contact: TContactTag, type: EObjectChangeType) => void;
}

export type TUseContactTag = ReturnType<typeof useContactTag>;

const useContactTag = (
  contactTag: TContactTag | TContactTag["id"],
  options?: IUseContactTagOptions,
) => {
  /** Values */

  const snackbar = useSnackbar();
  const confirm = useConfirm();

  const isId = typeof contactTag === "number";
  const contactTagId = isId ? contactTag : contactTag.id;
  const isNonExistentContactTag = contactTagId === NULL_ID;

  /** Queries */

  const contactTagQuery = useQuery({
    queryKey: contactEndpoints.tags.tag(contactTagId).id,
    queryFn: contactEndpoints.tags.tag(contactTagId).get,
    initialData: getPlaceholderContactTag({
      id: contactTagId,
      ...(isId ? {} : contactTag),
    }),
    enabled: isId && !isNonExistentContactTag,
  });

  /** Mutations */

  const createMutation = useMutation({
    mutationKey: [contactEndpoints.tags.id, EObjectChangeType.Create],
    mutationFn: contactEndpoints.tags.post,
    onSuccess: (res) => {
      options?.onChange?.(res, EObjectChangeType.Create);
      snackbar.enqueueSnackbar(
        `${markdownUtils.bold(res.label)} created successfully`,
        { variant: "success" },
      );
    },
    onError: (error) =>
      snackbar.enqueueSnackbar(errorUtils.getErrorMessage(error), {
        variant: "error",
      }),
  });

  const updateMutation = useMutation({
    mutationKey: [
      contactEndpoints.tags.tag(contactTagId).id,
      EObjectChangeType.Update,
    ],
    mutationFn: contactEndpoints.tags.tag(contactTagId).patch,
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
    mutationKey: [
      contactEndpoints.tags.tag(contactTagId).id,
      EObjectChangeType.Delete,
    ],
    mutationFn: contactEndpoints.tags.tag(contactTagId).delete,
    onSuccess: () => {
      options?.onChange?.(contactTagQuery.data, EObjectChangeType.Delete);
      snackbar.enqueueSnackbar(
        `${markdownUtils.bold(contactTagQuery.data.label)} deleted`,
        { variant: "success" },
      );
    },
    onError: (error) =>
      snackbar.enqueueSnackbar(errorUtils.getErrorMessage(error), {
        variant: "error",
      }),
  });

  /** Data */

  const isMutating = isNonExistentContactTag
    ? createMutation.isPending
    : updateMutation.isPending || deleteMutation.isPending;
  const isDisabled =
    options?.disabled ||
    isMutating ||
    (contactTagQuery.isEnabled && !contactTagQuery.isSuccess);
  const isChangeDisabled = isDisabled || !options?.onChange;

  /** Callbacks */

  const handleCreate = createMutation.mutate;

  const handleUpdate = updateMutation.mutate;

  const handleDelete = useCallback(
    (...options: Parameters<typeof deleteMutation.mutate>) =>
      confirm(
        {
          title: `Delete ${contactTagQuery.data.label}?`,
          description: `Are you sure you want to delete this contact tag? This operation is irreversible.`,
        },
        () => deleteMutation.mutate(...options),
      ),
    [confirm, deleteMutation],
  );

  /** Options */

  const baseMenuOptions: IMenuOption<
    EContactTagOptionId,
    EContactTagOptionId
  >[] = useMemo(
    () => [
      {
        id: EContactTagOptionId.Delete,
        render: !options?.hideOptions?.includes(EContactTagOptionId.Delete),
        value: EContactTagOptionId.Delete,
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
          ? options.options(contactTagQuery.data, baseMenuOptions)
          : options.options
        : baseMenuOptions,
    [contactTagQuery.data, options?.options, baseMenuOptions],
  );

  return {
    contactTag: contactTagQuery.data,
    options: menuOptions,
    disabled: isDisabled,
    isLoading: contactTagQuery.isLoading,
    isMutating: isMutating,
    queries: { contactTag: contactTagQuery },
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

export default useContactTag;
