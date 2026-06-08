import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import "reset-css/reset.css";
import "./store/utils/string";
import "./store/utils/number";
import "./store/utils/dayjs";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import router from "./store/config/router";
import RootProvider from "./containers/providers/RootProvider";

export { router };

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <RootProvider />
    </StrictMode>,
  );
}
