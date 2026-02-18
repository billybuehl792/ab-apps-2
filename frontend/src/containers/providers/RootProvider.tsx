import { type PropsWithChildren } from "react";
import { SnackbarProvider } from "notistack";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Snackbar, ThemeProvider } from "@mui/material";
import RouterProvider from "./RouterProvider";
import AuthProvider from "./AuthProvider";
import ConfirmProvider from "./ConfirmProvider";
import MenuProvider from "./MenuProvider";
import theme from "@/store/config/theme";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
});

const RootProvider: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      Components={{
        default: Snackbar,
        success: Snackbar,
        error: Snackbar,
        warning: Snackbar,
        info: Snackbar,
      }}
    >
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <ConfirmProvider>
            <MenuProvider>
              <AuthProvider>
                <RouterProvider />
                {children}
              </AuthProvider>
            </MenuProvider>
          </ConfirmProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </SnackbarProvider>
  );
};

export default RootProvider;
