import { createTheme } from "@mui/material";
import palette from "./palette";
import typography from "./typography";
import breakpoints from "./breakpoints";
import components from "./components";

declare module "@mui/material/styles" {
  interface Theme {
    layout: {
      page: { header: { height: number } };
      nav: { height: number; panelWidth: number };
    };
  }
  interface ThemeOptions {
    layout?: {
      page?: { header?: { height?: number } };
      nav?: { height?: number; panelWidth?: number };
    };
  }
}

const theme = createTheme({
  breakpoints,
  components,
  palette,
  typography,

  layout: {
    page: { header: { height: 64 } },
    nav: { height: 56, panelWidth: 240 },
  },
});

export default theme;
