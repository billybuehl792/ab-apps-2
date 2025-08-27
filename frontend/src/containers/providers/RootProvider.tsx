import { type PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@mui/material";
import RouterProvider from "./RouterProvider";
import AuthProvider from "./AuthProvider";
import ConfirmProvider from "./ConfirmProvider";
import { theme } from "@/store/config/theme";

const RootProvider = ({ children }: PropsWithChildren) => {
  /** Values */

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <ConfirmProvider>
          <AuthProvider>
            <RouterProvider>{children}</RouterProvider>
          </AuthProvider>
        </ConfirmProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default RootProvider;
