import { useCallback, useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { Delete, Edit, Info } from "@mui/icons-material";
import useConfirm from "./useConfirm";
import { jobMutations } from "../mutations/jobs";
import { errorUtils } from "../utils/error";
import { EJobOptionId } from "../enums/jobs";
import { EObjectChangeType } from "../enums/api";
import type { TJob } from "../types/jobs";

type TJobMenuOption = IMenuOption<EJobOptionId, EJobOptionId>;

export interface IUseJobOptions {
  disabled?: boolean;
  hideOptions?: EJobOptionId[];
  options?:
    | TJobMenuOption[]
    | ((job: TJob, baseMenuOptions: TJobMenuOption[]) => TJobMenuOption[]);
  onChange?: (job: TJob, type: EObjectChangeType) => void;
}

export type TUseJob = ReturnType<typeof useJob>;

const useJob = (job: TJob, options?: IUseJobOptions) => {
  /** Values */

  const snackbar = useSnackbar();
  const confirm = useConfirm();

  /** Mutations */

  const updateMutation = useMutation({
    ...jobMutations.job(job.id).update,
    onSuccess: (res) => {
      options?.onChange?.(res, EObjectChangeType.Update);
      snackbar.enqueueSnackbar(`Job updated successfully`, {
        variant: "success",
      });
    },
    onError: (error) =>
      snackbar.enqueueSnackbar(errorUtils.getErrorMessage(error), {
        variant: "error",
      }),
  });

  const deleteMutation = useMutation({
    ...jobMutations.job(job.id).delete,
    onSuccess: () => {
      options?.onChange?.(job, EObjectChangeType.Delete);
      snackbar.enqueueSnackbar(`Job deleted`, { variant: "success" });
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
          title: `Delete Job?`,
          description: `Are you sure you want to delete this job? This operation is irreversible.`,
        },
        () => deleteMutation.mutate(...options),
      ),
    [confirm, deleteMutation],
  );

  /** Options */

  const baseMenuOptions: IMenuOption<EJobOptionId, EJobOptionId>[] = useMemo(
    () => [
      {
        id: EJobOptionId.Detail,
        render: !options?.hideOptions?.includes(EJobOptionId.Detail),
        value: EJobOptionId.Detail,
        label: "Detail",
        Icon: Info,
        isDisabled: isDisabled,
        link: { to: "/app/jobs/$id", params: { id: job.id } },
      },
      {
        id: EJobOptionId.Edit,
        render: !options?.hideOptions?.includes(EJobOptionId.Edit),
        value: EJobOptionId.Edit,
        label: "Edit",
        Icon: Edit,
        isDisabled: isDisabled,
        link: { to: "/app/jobs/edit/$id", params: { id: job.id } },
      },
      {
        id: EJobOptionId.Delete,
        render: !options?.hideOptions?.includes(EJobOptionId.Delete),
        value: EJobOptionId.Delete,
        label: "Delete",
        Icon: Delete,
        color: "error.main",
        isDisabled: isChangeDisabled,
        onClick: handleDelete,
      },
    ],
    [options?.hideOptions, isDisabled, job.id, isChangeDisabled, handleDelete],
  );

  const menuOptions = useMemo(
    () =>
      options?.options
        ? typeof options.options === "function"
          ? options.options(job, baseMenuOptions)
          : options.options
        : baseMenuOptions,
    [options, job, baseMenuOptions],
  );

  return {
    job,
    options: menuOptions,
    disabled: isDisabled,
    isMutating: isMutating,
    mutations: { update: updateMutation, delete: deleteMutation },
    update: handleUpdate,
    delete: handleDelete,
  };
};

export default useJob;
