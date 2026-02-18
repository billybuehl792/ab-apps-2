import qs from "qs";
import { routeTree } from "@/routeTree.gen";
import { createRouter } from "@tanstack/react-router";
import { Home } from "@mui/icons-material";
import CustomLink from "@/components/links/CustomLink";
import StatusWrapper from "@/components/layout/StatusWrapper";
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
  defaultPendingComponent: () => <StatusWrapper loading />,
  defaultErrorComponent: ({ error }) => <StatusWrapper error={error} />,
  defaultNotFoundComponent: () => (
    <StatusWrapper
      error={{
        label: "Page not found :(",
        actions: [
          <CustomLink label="Home" icon={<Home />} to="/app/dashboard" />,
        ],
      }}
    />
  ),
});

export default router;
