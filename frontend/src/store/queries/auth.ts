import { queryOptions } from "@tanstack/react-query";
import api from "../api";
import ROUTES from "../constants/routes";
import type { User } from "../types";

const me = () =>
  queryOptions({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const res = await api.get<User>(ROUTES.AUTH.ME);
      return res.data;
    },
  });

export const authQueries = {
  me,
};
