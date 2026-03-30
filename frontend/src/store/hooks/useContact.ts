import { useCallback, useMemo } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { Delete, Edit, Info } from "@mui/icons-material";
import useConfirm from "./useConfirm";
import { errorUtils } from "../utils/error";
import { contactEndpoints, getPlaceholderContact } from "../constants/contacts";
import { EContactOptionId } from "../enums/contacts";
import { EObjectChangeType } from "../enums/api";
import { NULL_ID } from "../constants/api";
import { markdownUtils } from "../utils/markdown";
import type { TContact } from "../types/contacts";

type TContactMenuOption = IMenuOption<EContactOptionId, EContactOptionId>;

export interface IUseContactOptions {
  disabled?: boolean;
  hideOptions?: EContactOptionId[];
  options?:
    | TContactMenuOption[]
    | ((
        contact: TContact,
        baseMenuOptions: TContactMenuOption[],
      ) => TContactMenuOption[]);
  onChange?: (contact: TContact, type: EObjectChangeType) => void;
}

export type TUseContact = ReturnType<typeof useContact>;

const useContact = (
  contact: TContact | TContact["id"],
  options?: IUseContactOptions,
) => {
  /** Values */

  const snackbar = useSnackbar();
  const confirm = useConfirm();

  const isId = typeof contact === "number";
  const contactId = isId ? contact : contact.id;
  const isNonExistentContact = contactId === NULL_ID;

  /** Queries */

  const contactQuery = useQuery({
    queryKey: contactEndpoints.contact(contactId).id,
    queryFn: contactEndpoints.contact(contactId).get,
    initialData: getPlaceholderContact({
      id: contactId,
      ...(isId ? {} : contact),
    }),
    enabled: isId && !isNonExistentContact,
  });

  /** Mutations */

  const createMutation = useMutation({
    mutationKey: [contactEndpoints.id, EObjectChangeType.Create],
    mutationFn: contactEndpoints.post,
    onSuccess: (res) => {
      const fullName = `${res.first_name} ${res.last_name}`;
      options?.onChange?.(res, EObjectChangeType.Create);
      snackbar.enqueueSnackbar(
        `${markdownUtils.bold(fullName)} created successfully`,
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
      contactEndpoints.contact(contactId).id,
      EObjectChangeType.Update,
    ],
    mutationFn: contactEndpoints.contact(contactId).patch,
    onSuccess: (res) => {
      const fullName = `${res.first_name} ${res.last_name}`;
      options?.onChange?.(res, EObjectChangeType.Update);
      snackbar.enqueueSnackbar(
        `${markdownUtils.bold(fullName)} updated successfully`,
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
      contactEndpoints.contact(contactId).id,
      EObjectChangeType.Delete,
    ],
    mutationFn: contactEndpoints.contact(contactId).delete,
    onSuccess: () => {
      const fullName = `${contactQuery.data.first_name} ${contactQuery.data.last_name}`;
      options?.onChange?.(contactQuery.data, EObjectChangeType.Delete);
      snackbar.enqueueSnackbar(`${markdownUtils.bold(fullName)} deleted`, {
        variant: "success",
      });
    },
    onError: (error) =>
      snackbar.enqueueSnackbar(errorUtils.getErrorMessage(error), {
        variant: "error",
      }),
  });

  /** Data */

  const isMutating = isNonExistentContact
    ? createMutation.isPending
    : updateMutation.isPending || deleteMutation.isPending;
  const isDisabled =
    options?.disabled ||
    isMutating ||
    (contactQuery.isEnabled && !contactQuery.isSuccess);
  const isChangeDisabled = isDisabled || !options?.onChange;

  /** Callbacks */

  const handleCreate = createMutation.mutate;

  const handleUpdate = updateMutation.mutate;

  const handleDelete = useCallback(
    (...options: Parameters<typeof deleteMutation.mutate>) =>
      confirm(
        {
          title: `Delete ${contactQuery.data.first_name} ${contactQuery.data.last_name}?`,
          description: `Are you sure you want to delete this contact? This operation is irreversible.`,
        },
        () => deleteMutation.mutate(...options),
      ),
    [confirm, deleteMutation],
  );

  /** Options */

  const baseMenuOptions: IMenuOption<EContactOptionId, EContactOptionId>[] =
    useMemo(
      () => [
        {
          id: EContactOptionId.Detail,
          render: !options?.hideOptions?.includes(EContactOptionId.Detail),
          value: EContactOptionId.Detail,
          label: "Detail",
          Icon: Info,
          isDisabled: isDisabled,
          link: {
            to: "/app/directory/contacts/$id",
            params: { id: String(contactId) },
          },
        },
        {
          id: EContactOptionId.Edit,
          render: !options?.hideOptions?.includes(EContactOptionId.Edit),
          value: EContactOptionId.Edit,
          label: "Edit",
          Icon: Edit,
          isDisabled: isDisabled,
          link: {
            to: "/app/directory/contacts/$id/edit",
            params: { id: String(contactId) },
          },
        },
        {
          id: EContactOptionId.Delete,
          render: !options?.hideOptions?.includes(EContactOptionId.Delete),
          value: EContactOptionId.Delete,
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
          ? options.options(contactQuery.data, baseMenuOptions)
          : options.options
        : baseMenuOptions,
    [contactQuery.data, options?.options, baseMenuOptions],
  );

  return {
    contact: contactQuery.data,
    options: menuOptions,
    disabled: isDisabled,
    isLoading: contactQuery.isLoading,
    isMutating: isMutating,
    queries: { contact: contactQuery },
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

export default useContact;
