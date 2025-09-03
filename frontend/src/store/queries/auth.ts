import { queryOptions } from "@tanstack/react-query";
import { queryUtils } from "../utils/queries";
import { authApi } from "../api/auth";

const me = () =>
  queryOptions({
    queryKey: queryUtils.getQueryKey(["auth", "me"]),
    queryFn: () => authApi.me().then((res) => res.data),
  });

export const authQueries = {
  me,
};
