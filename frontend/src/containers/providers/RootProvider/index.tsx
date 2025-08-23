import { type PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RouterProvider from "../RouterProvider";
import AuthProvider from "../AuthProvider";

const RootProvider = ({ children }: PropsWithChildren) => {
  /** Values */

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider>{children}</RouterProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default RootProvider;
