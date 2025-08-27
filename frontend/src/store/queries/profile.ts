import { queryOptions } from "@tanstack/react-query";
import api from "../api";
import ROUTES from "../constants/routes";
import type { User } from "../types";

const me = () =>
  queryOptions({
    queryKey: ["profile", "me"],
    queryFn: async () => {
      const res = await api.get<User>(ROUTES.PROFILE.ME);

      return res.data;
    },
  });

export const profileQueries = {
  me,
};
