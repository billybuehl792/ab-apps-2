import { mutationOptions } from "@tanstack/react-query";
import { clientApi } from "../api/clients";

const create = () =>
  mutationOptions({
    mutationKey: ["clients", "create"],
    mutationFn: clientApi.create,
  });

const update = () =>
  mutationOptions({
    mutationKey: ["clients", "update"],
    mutationFn: clientApi.update,
  });

const _delete = () =>
  mutationOptions({
    mutationKey: ["clients", "delete"],
    mutationFn: clientApi.delete,
  });

export const clientMutations = {
  create,
  update,
  delete: _delete,
};
