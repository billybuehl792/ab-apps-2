import { mutationOptions } from "@tanstack/react-query";
import api from "../config/api";
import endpoints from "../constants/endpoints";
import { Client } from "../types";

const create = () =>
  mutationOptions({
    mutationKey: ["clients", "create"],
    mutationFn: async (body: Omit<Client, "id">) => {
      const res = await api.post<Client>(endpoints.clients(), body);

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
  delete: _delete,
};
