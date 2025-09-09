import { mutationOptions } from "@tanstack/react-query";
import { clientApi } from "../api/clients";
import { queryUtils } from "../utils/queries";

const create = () =>
  mutationOptions({
    mutationKey: queryUtils.getQueryKey(["clients", "create"]),
    mutationFn: clientApi.create,
  });

const update = () =>
  mutationOptions({
    mutationKey: queryUtils.getQueryKey(["clients", "update"]),
    mutationFn: clientApi.update,
  });

const _delete = () =>
  mutationOptions({
    mutationKey: queryUtils.getQueryKey(["clients", "delete"]),
    mutationFn: clientApi.delete,
  });

export const clientMutations = {
  create,
  update,
  delete: _delete,
};
