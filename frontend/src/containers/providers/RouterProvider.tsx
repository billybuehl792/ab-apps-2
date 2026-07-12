import {
  type RouterProps,
  RouterProvider as TanstackRouterProvider,
} from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "@/store/config/router";
import useAuth from "@/store/hooks/useAuth";

const RouterProvider: React.FC<Omit<RouterProps, "router" | "context">> = (
  props,
) => {
  /** Values */

  const queryClient = useQueryClient();
  const auth = useAuth();

  return (
    <TanstackRouterProvider
      router={router}
      context={{ queryClient, auth }}
      {...props}
    />
  );
};

export default RouterProvider;
