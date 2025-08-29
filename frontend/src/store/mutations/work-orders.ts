import { mutationOptions } from "@tanstack/react-query";
import { workOrderApi } from "../api/work-orders";

const create = () =>
  mutationOptions({
    mutationKey: ["work-orders", "create"],
    mutationFn: workOrderApi.create,
  });

const update = () =>
  mutationOptions({
    mutationKey: ["work-orders", "update"],
    mutationFn: workOrderApi.update,
  });

const _delete = () =>
  mutationOptions({
    mutationKey: ["work-orders", "delete"],
    mutationFn: workOrderApi.delete,
  });

export const workOrderMutations = {
  create,
  update,
  delete: _delete,
};
