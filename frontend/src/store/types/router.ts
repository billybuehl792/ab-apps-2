import { type ComponentProps, type ContextType } from "react";
import { type QueryClient } from "@tanstack/react-query";
import { type SvgIconComponent } from "@mui/icons-material";
import type PageHeader from "@/components/layout/PageHeader";
import type AuthContext from "../context/AuthContext";

export interface GlobalRouterContext {
  queryClient: QueryClient;
  auth: ContextType<typeof AuthContext>;
}

interface RouteCrumb {
  label: string;
  Icon?: SvgIconComponent;
}

interface RouteLoaderDataBase {
  crumb?: RouteCrumb;
  slotProps?: {
    pageHeader?: Partial<ComponentProps<typeof PageHeader>>;
  };
}

export type RouteLoaderData<T = never> = [T] extends [never]
  ? RouteLoaderDataBase & { data?: undefined }
  : RouteLoaderDataBase & { data: T };
