import { type ReactNode, type ContextType } from "react";
import { type QueryClient } from "@tanstack/react-query";
import { type SvgIconComponent } from "@mui/icons-material";
import type AuthContext from "../context/AuthContext";

export interface IGlobalRouterContext {
  queryClient: QueryClient;
  auth: ContextType<typeof AuthContext>;
  crumb?: {
    label: ReactNode;
    Icon?: SvgIconComponent;
    exact?: boolean;
  } | null;
  pageHeaderEndContent?: ReactNode;
}
