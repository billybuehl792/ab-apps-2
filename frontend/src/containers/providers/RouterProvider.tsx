import {
  type RouterProps,
  RouterProvider as TanstackRouterProvider,
} from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
// import { router } from "@/main";
import useAuth from "@/store/hooks/useAuth";
import router from "@/store/config/router";

type TRouterProviderProps = Omit<RouterProps, "router" | "context">;

const RouterProvider: React.FC<TRouterProviderProps> = (props) => {
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
