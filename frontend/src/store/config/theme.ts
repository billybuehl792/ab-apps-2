import { createTheme } from "@mui/material";

export const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 650,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  components: {
    MuiAvatar: {
      defaultProps: {
        sx: {
          width: 32,
          height: 32,
          fontSize: 16,
        },
      },
    },
    MuiButton: {
      defaultProps: {
        variant: "outlined",
      },
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
    MuiCard: {
      defaultProps: {
        variant: "outlined",
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: 16,
          "&:last-child": {
            paddingBottom: 16,
          },
        },
      },
    },
    MuiCardActions: {
      styleOverrides: {
        root: {
          padding: 16,
        },
      },
    },
    MuiDialogContent: {
      defaultProps: { dividers: true },
    },
    MuiIconButton: {
      styleOverrides: {
        sizeSmall: {
          fontSize: "1rem",
          padding: 2,
        },
        sizeMedium: {
          fontSize: "1.25rem",
          padding: 5,
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        fontSizeSmall: {
          fontSize: "1rem",
        },
        fontSizeMedium: {
          fontSize: "1.25rem",
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
      },
      styleOverrides: {
        root: {
          input: {
            "::-webkit-search-cancel-button": { WebkitAppearance: "none" },
          },
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: ({ theme }) => ({
          position: "relative",
          height: "100%",
          [theme.breakpoints.up("xs")]: {
            minHeight: "unset",
          },
          [theme.breakpoints.up("sm")]: {
            minHeight: "unset",
          },
        }),
      },
    },
  },
  palette: {
    primary: {
      main: "#2b4277",
      contrastText: "#fff",
      dark: "#0E1114",
      light: "#DEDEDE",
    },
  },
});
