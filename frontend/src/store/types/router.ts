import { type QueryClient } from "@tanstack/react-query";
import { type ComponentProps, type ContextType } from "react";
import type AuthContext from "../context/AuthContext";
import type PageHeader from "@/components/layout/PageHeader";

export interface GlobalRouterContext {
  queryClient: QueryClient;
  auth: ContextType<typeof AuthContext>;
  slotProps?: {
    pageHeader?: Partial<ComponentProps<typeof PageHeader>>;
  };
}
