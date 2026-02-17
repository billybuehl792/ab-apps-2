import { mutationOptions } from "@tanstack/react-query";
import { clientApi } from "../api/clients";
import { queryUtils } from "../utils/queries";
import { EObjectChangeType } from "../enums/api";

const create = () =>
  mutationOptions({
    mutationKey: queryUtils.getQueryKey(["clients", EObjectChangeType.CREATE]),
    mutationFn: clientApi.create,
  });

const update = () =>
  mutationOptions({
    mutationKey: queryUtils.getQueryKey(["clients", EObjectChangeType.UPDATE]),
    mutationFn: clientApi.update,
  });

const _delete = () =>
  mutationOptions({
    mutationKey: queryUtils.getQueryKey(["clients", EObjectChangeType.DELETE]),
    mutationFn: clientApi.delete,
  });

export const clientMutations = {
  create,
  update,
  delete: _delete,
};
