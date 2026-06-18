import { SnackbarProvider } from "notistack";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@mui/material";
import RouterProvider from "./RouterProvider";
import AuthProvider from "./AuthProvider";
import ConfirmProvider from "./ConfirmProvider";
import MenuProvider from "./MenuProvider";
import Snackbar from "@/components/alerts/Snackbar";
import theme from "@/store/config/theme";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
});

const RootProvider: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider
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
          <ConfirmProvider>
            <MenuProvider>
              <AuthProvider>
                <RouterProvider />
              </AuthProvider>
            </MenuProvider>
          </ConfirmProvider>
        </QueryClientProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
};

export default RootProvider;
