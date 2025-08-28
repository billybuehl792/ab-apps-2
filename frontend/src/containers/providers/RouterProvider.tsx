import { type PropsWithChildren } from "react";
import { RouterProvider as TanstackRouterProvider } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "@/main";
import useAuth from "@/store/hooks/useAuth";

const RouterProvider = ({
  children: _children,
  ...props
}: PropsWithChildren) => {
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
