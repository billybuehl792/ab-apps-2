import { useCallback, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { Delete, Edit, Info } from "@mui/icons-material";
import useConfirm from "./useConfirm";
import { contactMutations } from "../mutations/contacts";
import { errorUtils } from "../utils/error";
import { markdownUtils } from "../utils/markdown";
import { EContactOptionId } from "../enums/contacts";
import { EObjectChangeType } from "../enums/api";
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

const useContact = (contact: TContact, options?: IUseContactOptions) => {
  /** Values */

  const snackbar = useSnackbar();
  const confirm = useConfirm();
  const navigate = useNavigate();

  const fullName = `${contact.first_name} ${contact.last_name}`;

  /** Mutations */

  const updateMutation = useMutation({
    ...contactMutations.contact(contact.id).update,
    onSuccess: (res) => {
      options?.onChange?.(res, EObjectChangeType.Update);
      snackbar.enqueueSnackbar(
        `${markdownUtils.bold(`${res.first_name} ${res.last_name}`)} updated successfully`,
        { variant: "success" },
      );
    },
    onError: (error) =>
      snackbar.enqueueSnackbar(errorUtils.getErrorMessage(error), {
        variant: "error",
      }),
  });

  const deleteMutation = useMutation({
    ...contactMutations.contact(contact.id).delete,
    onSuccess: () => {
      options?.onChange?.(contact, EObjectChangeType.Delete);
      snackbar.enqueueSnackbar(`${markdownUtils.bold(fullName)} deleted`, {
        variant: "success",
      });
    },
    onError: (error) =>
      snackbar.enqueueSnackbar(errorUtils.getErrorMessage(error), {
        variant: "error",
      }),
  });

  const createDocumentMutation = useMutation({
    ...contactMutations.contact(contact.id).documents.create,
    onSuccess: (res) => {
      options?.onChange?.(contact, EObjectChangeType.Update);
      snackbar.enqueueSnackbar(`${res.label} uploaded`, {
        variant: "success",
      });
    },
    onError: () =>
      snackbar.enqueueSnackbar("Upload failed", { variant: "error" }),
  });

  const deleteDocumentMutation = useMutation({
    ...contactMutations.contact(contact.id).documents.delete,
    onSuccess: () => {
      options?.onChange?.(contact, EObjectChangeType.Update);
      snackbar.enqueueSnackbar("Document deleted", { variant: "success" });
    },
    onError: () =>
      snackbar.enqueueSnackbar("Document delete failed", { variant: "error" }),
  });

  /** Data */

  const isMutating = updateMutation.isPending || deleteMutation.isPending;
  const isDisabled = options?.disabled || isMutating;
  const isChangeDisabled = isDisabled || !options?.onChange;

  /** Callbacks */

  const handleView = () =>
    navigate({
      to: "/app/contacts/$id",
      params: { id: String(contact.id) },
    });

  const handleEdit = () =>
    navigate({
      to: "/app/contacts/edit/$id",
      params: { id: String(contact.id) },
    });

  const handleUpdate = updateMutation.mutate;

  const handleDelete = useCallback(
    (...options: Parameters<typeof deleteMutation.mutate>) =>
      confirm(
        {
          title: `Delete ${fullName}?`,
          description: `Are you sure you want to delete this contact? This operation is irreversible.`,
        },
        () => deleteMutation.mutate(...options),
      ),
    [confirm, deleteMutation, fullName],
  );

  const handleCreateDocument = createDocumentMutation.mutate;

  const handleDeleteDocument = useCallback(
    (...options: Parameters<typeof deleteDocumentMutation.mutate>) =>
      confirm(
        {
          title: `Delete ${fullName}?`,
          description: `Are you sure you want to delete this document? This operation is irreversible.`,
        },
        () => deleteDocumentMutation.mutate(...options),
      ),
    [confirm, deleteDocumentMutation, fullName],
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
            to: "/app/contacts/$id",
            params: { id: String(contact.id) },
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
            to: "/app/contacts/edit/$id",
            params: { id: String(contact.id) },
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
      [
        options?.hideOptions,
        isDisabled,
        contact.id,
        isChangeDisabled,
        handleDelete,
      ],
    );

  const menuOptions = useMemo(
    () =>
      options?.options
        ? typeof options.options === "function"
          ? options.options(contact, baseMenuOptions)
          : options.options
        : baseMenuOptions,
    [options, contact, baseMenuOptions],
  );

  return {
    contact,
    options: menuOptions,
    disabled: isDisabled,
    isMutating: isMutating,
    mutations: {
      update: updateMutation,
      delete: deleteMutation,
      documents: {
        create: createDocumentMutation,
        delete: deleteDocumentMutation,
      },
    },
    update: handleUpdate,
    delete: handleDelete,
    createDocument: handleCreateDocument,
    deleteDocument: handleDeleteDocument,
    view: handleView,
    edit: handleEdit,
  };
};

export default useContact;
