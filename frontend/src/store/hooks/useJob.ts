import { useCallback, useMemo } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { Delete, Edit, Info } from "@mui/icons-material";
import useConfirm from "./useConfirm";
import { errorUtils } from "../utils/error";
import { jobEndpoints, getPlaceholderJob } from "../constants/jobs";
import { EJobOptionId } from "../enums/jobs";
import { EObjectChangeType } from "../enums/api";
import { NULL_ID } from "../constants/api";
import { markdownUtils } from "../utils/markdown";
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

const useJob = (job: TJob | TJob["id"], options?: IUseJobOptions) => {
  /** Values */

  const snackbar = useSnackbar();
  const confirm = useConfirm();

  const isId = typeof job === "number";
  const jobId = isId ? job : job.id;
  const isNonExistentJob = jobId === NULL_ID;

  /** Queries */

  const jobQuery = useQuery({
    queryKey: jobEndpoints.job(jobId).id,
    queryFn: jobEndpoints.job(jobId).get,
    initialData: getPlaceholderJob({
      id: jobId,
      ...(isId ? {} : job),
    }),
    enabled: isId && !isNonExistentJob,
  });

  /** Mutations */

  const createMutation = useMutation({
    mutationKey: [jobEndpoints.id, EObjectChangeType.Create],
    mutationFn: jobEndpoints.post,
    onSuccess: (res) => {
      const label = res.label ?? `Job ${res.id}`;
      options?.onChange?.(res, EObjectChangeType.Create);
      snackbar.enqueueSnackbar(
        `${markdownUtils.bold(label)} created successfully`,
        { variant: "success" },
      );
    },
    onError: (error) =>
      snackbar.enqueueSnackbar(errorUtils.getErrorMessage(error), {
        variant: "error",
      }),
  });

  const updateMutation = useMutation({
    mutationKey: [jobEndpoints.job(jobId).id, EObjectChangeType.Update],
    mutationFn: jobEndpoints.job(jobId).patch,
    onSuccess: (res) => {
      const label = res.label ?? `Job ${res.id}`;
      options?.onChange?.(res, EObjectChangeType.Update);
      snackbar.enqueueSnackbar(
        `${markdownUtils.bold(label)} updated successfully`,
        { variant: "success" },
      );
    },
    onError: (error) =>
      snackbar.enqueueSnackbar(errorUtils.getErrorMessage(error), {
        variant: "error",
      }),
  });

  const deleteMutation = useMutation({
    mutationKey: [jobEndpoints.job(jobId).id, EObjectChangeType.Delete],
    mutationFn: jobEndpoints.job(jobId).delete,
    onSuccess: () => {
      const label = jobQuery.data.label ?? `Job ${jobQuery.data.id}`;
      options?.onChange?.(jobQuery.data, EObjectChangeType.Delete);
      snackbar.enqueueSnackbar(`${markdownUtils.bold(label)} deleted`, {
        variant: "success",
      });
    },
    onError: (error) =>
      snackbar.enqueueSnackbar(errorUtils.getErrorMessage(error), {
        variant: "error",
      }),
  });

  /** Data */

  const isMutating = isNonExistentJob
    ? createMutation.isPending
    : updateMutation.isPending || deleteMutation.isPending;
  const isDisabled =
    options?.disabled ||
    isMutating ||
    (jobQuery.isEnabled && !jobQuery.isSuccess);
  const isChangeDisabled = isDisabled || !options?.onChange;

  /** Callbacks */

  const handleCreate = createMutation.mutate;

  const handleUpdate = updateMutation.mutate;

  const handleDelete = useCallback(
    (...options: Parameters<typeof deleteMutation.mutate>) =>
      confirm(
        {
          title: `Delete ${jobQuery.data.label ?? `Job ${jobQuery.data.id}`}?`,
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
        link: {
          to: "/app/board/jobs/$id",
          params: { id: String(jobId) },
        },
      },
      {
        id: EJobOptionId.Edit,
        render: !options?.hideOptions?.includes(EJobOptionId.Edit),
        value: EJobOptionId.Edit,
        label: "Edit",
        Icon: Edit,
        isDisabled: isDisabled,
        link: {
          to: "/app/board/jobs/$id/edit",
          params: { id: String(jobId) },
        },
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
    [isDisabled, isChangeDisabled, handleDelete, options],
  );

  const menuOptions = useMemo(
    () =>
      options?.options
        ? typeof options.options === "function"
          ? options.options(jobQuery.data, baseMenuOptions)
          : options.options
        : baseMenuOptions,
    [jobQuery.data, options?.options, baseMenuOptions],
  );

  return {
    job: jobQuery.data,
    options: menuOptions,
    disabled: isDisabled,
    isLoading: jobQuery.isLoading,
    isMutating: isMutating,
    queries: { job: jobQuery },
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

export default useJob;
