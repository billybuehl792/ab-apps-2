import { queryOptions } from "@tanstack/react-query";
import api from "../config/api";
import endpoints from "../constants/endpoints";
import type { User } from "../types";

const me = () =>
  queryOptions({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const res = await api.get<User>(endpoints.auth.me());

      return res.data;
    },
  });

export const authQueries = {
  me,
};
