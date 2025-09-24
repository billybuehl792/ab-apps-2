import { StrictMode } from "react";
import qs from "qs";
import ReactDOM from "react-dom/client";
import RootProvider from "./containers/providers/RootProvider";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import StatusCard from "./components/cards/StatusCard";

import "reset-css/reset.css";
import "./store/utils/string";
import "./store/utils/number";
import "./store/utils/dayjs";

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export const router = createRouter({
  routeTree,
  defaultPendingMs: 0,
  context: { queryClient: undefined!, auth: undefined! },
  parseSearch: (searchStr) => qs.parse(searchStr, { ignoreQueryPrefix: true }),
  stringifySearch: (searchObj) => {
    const str = qs.stringify(searchObj, { arrayFormat: "repeat" });
    return str ? `?${str}` : "";
  },
  defaultPendingComponent: () => <StatusCard loading />,
  defaultErrorComponent: ({ error }) => <StatusCard error={error} />,
  defaultNotFoundComponent: () => <StatusCard error="Page not found :(" />,
});

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <RootProvider />
    </StrictMode>
  );
}
