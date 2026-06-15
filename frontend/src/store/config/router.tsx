import qs from "qs";
import { routeTree } from "@/routeTree.gen";
import { createRouter } from "@tanstack/react-router";
import { Container } from "@mui/material";
import StatusWrapper from "@/components/layout/StatusWrapper";
import PageNotFoundCard from "@/components/cards/PageNotFoundCard";
import type { IGlobalRouterContext } from "../types/router";
import FullScreen from "@/components/layout/FullScreen";

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
  defaultPendingComponent: () => (
    <Container maxWidth="md" sx={{ my: 2 }}>
      <StatusWrapper loading />
    </Container>
  ),
  defaultErrorComponent: ({ error }) => (
    <Container maxWidth="md" sx={{ my: 2 }}>
      <StatusWrapper error={error} />
    </Container>
  ),
  defaultNotFoundComponent: () => (
    <FullScreen>
      <PageNotFoundCard />
    </FullScreen>
  ),
});

export default router;
