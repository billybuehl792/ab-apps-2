import { queryOptions } from "@tanstack/react-query";
import api from "../config/api";
import endpoints from "../constants/endpoints";
import type { Client } from "../types";

const detail = (id: string) =>
  queryOptions({
    queryKey: ["clients", "detail", id],
    queryFn: async () => {
      const res = await api.get<Client>(endpoints.clients.detail(id));
      return res.data;
    },
  });

const list = () =>
  queryOptions({
    queryKey: ["clients", "list"],
    queryFn: async () => {
      const res = await api.get<ListRequest<Client>>(endpoints.clients());
      return res.data;
    },
  });

export const clientQueries = {
  detail,
  list,
};
