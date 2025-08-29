import { type ContextType, StrictMode } from "react";
import ReactDOM from "react-dom/client";
import RootProvider from "./containers/providers/RootProvider";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import StatusCard from "./components/cards/StatusCard";
import type AuthContext from "./store/context/AuthContext";
import "reset-css/reset.css";

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export const router = createRouter({
  routeTree,
  defaultPendingMs: 0,
  context: {
    queryClient: null!,
    auth: {} as ContextType<typeof AuthContext>,
  },
  defaultErrorComponent: ({ error }) => <StatusCard error={error} m={2} />,
  defaultPendingComponent: () => <StatusCard loading m={2} />,
  defaultNotFoundComponent: () => (
    <StatusCard error="Page not found :(" m={2} />
  ),
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
