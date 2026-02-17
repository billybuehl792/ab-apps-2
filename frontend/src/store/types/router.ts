import { type ComponentProps, type ContextType } from "react";
import { type QueryClient } from "@tanstack/react-query";
import { type SvgIconComponent } from "@mui/icons-material";
import type PageHeader from "@/components/layout/PageHeader";
import type AuthContext from "../context/AuthContext";

export interface IGlobalRouterContext {
  queryClient: QueryClient;
  auth: ContextType<typeof AuthContext>;
}

interface IRouteCrumb {
  label: string;
  Icon?: SvgIconComponent;
}

interface IRouteLoaderDataBase {
  crumb?: IRouteCrumb;
  slotProps?: {
    pageHeader?: Partial<ComponentProps<typeof PageHeader>>;
  };
}

export type TRouteLoaderData<T = never> = [T] extends [never]
  ? IRouteLoaderDataBase & { data?: undefined }
  : IRouteLoaderDataBase & { data: T };
