import { createRootRouteWithContext } from "@tanstack/react-router";
import type { IGlobalRouterContext } from "@/store/types/router";

export const Route = createRootRouteWithContext<IGlobalRouterContext>()();
