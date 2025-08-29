import { mutationOptions } from "@tanstack/react-query";
import api from "../config/api";
import endpoints from "../constants/endpoints";
import type { Client } from "../types";

const create = () =>
  mutationOptions({
    mutationKey: ["clients", "create"],
    mutationFn: async (body: Omit<Client, "id">) => {
      const res = await api.post<Client>(endpoints.clients(), body);

      return res.data;
    },
  });

const update = () =>
  mutationOptions({
    mutationKey: ["clients", "update"],
    mutationFn: async (
      body: Pick<Client, "id"> & Partial<Omit<Client, "id">>
    ) => {
      const res = await api.patch<Client>(
        endpoints.clients.detail(body.id),
        body
      );

      return res.data;
    },
  });

const _delete = () =>
  mutationOptions({
    mutationKey: ["clients", "delete"],
    mutationFn: async (id: string) => {
      await api.delete(endpoints.clients.detail(id));
    },
  });

export const clientMutations = {
  create,
  update,
  delete: _delete,
};
