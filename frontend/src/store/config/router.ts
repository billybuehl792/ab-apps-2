import qs from "qs";
import { routeTree } from "@/routeTree.gen";
import { createRouter } from "@tanstack/react-router";
import DefaultPendingComponent from "@/containers/layout/DefaultPendingComponent";
import DefaultErrorComponent from "@/containers/layout/DefaultErrorComponent";
import DefaultNotFoundComponent from "@/containers/layout/DefaultNotFoundComponent";
import type { IGlobalRouterContext } from "../types/router";

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const router = createRouter({
  routeTree,
  defaultPendingMs: 0,
  context: {} as IGlobalRouterContext,
  parseSearch: (searchStr) => qs.parse(searchStr, { ignoreQueryPrefix: true }),
  stringifySearch: (searchObj) => {
    const str = qs.stringify(searchObj, { arrayFormat: "repeat" });
    return str ? `?${str}` : "";
  },
  defaultPendingComponent: DefaultPendingComponent,
  defaultErrorComponent: DefaultErrorComponent,
  defaultNotFoundComponent: DefaultNotFoundComponent,
});

export default router;
