import { queryOptions } from "@tanstack/react-query";
import api from "../config/api";
import ROUTES from "../constants/routes";
import type { Client } from "../types";

const detail = (id: string) =>
  queryOptions({
    queryKey: ["clients", "detail", id],
    queryFn: async () => {
      const res = await api.get<Client>(ROUTES.CLIENTS.DETAIL(id));
      return res.data;
    },
  });

const list = () =>
  queryOptions({
    queryKey: ["clients", "list"],
    queryFn: async () => {
      const res = await api.get<ListRequest<Client>>(ROUTES.CLIENTS.LIST);
      return res.data;
    },
  });

export const clientQueries = {
  detail,
  list,
};
