import { mutationOptions } from "@tanstack/react-query";
import { workOrderApi } from "../api/work-orders";
import { queryUtils } from "../utils/queries";

const create = () =>
  mutationOptions({
    mutationKey: queryUtils.getQueryKey(["work-orders", "create"]),
    mutationFn: workOrderApi.create,
  });

const update = () =>
  mutationOptions({
    mutationKey: queryUtils.getQueryKey(["work-orders", "update"]),
    mutationFn: workOrderApi.update,
  });

const _delete = () =>
  mutationOptions({
    mutationKey: queryUtils.getQueryKey(["work-orders", "delete"]),
    mutationFn: workOrderApi.delete,
  });

export const workOrderMutations = {
  create,
  update,
  delete: _delete,
};
