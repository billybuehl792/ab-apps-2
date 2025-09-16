import { createTheme } from "@mui/material";

declare module "@mui/material/Chip" {
  interface ChipPropsSizeOverrides {
    xs: true;
    xxs: true;
  }
  interface ChipPropsColorOverrides {
    disabled: true;
  }
}

declare module "@mui/material/SvgIcon" {
  interface SvgIconPropsSizeOverrides {
    xs: true;
  }
}

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
    MuiChip: {
      variants: [
        {
          props: { size: "xxs" },
          style: {
            height: 18,
            fontSize: 10,
            borderRadius: 6,
            padding: 0,
            "& .MuiChip-icon": { fontSize: 10 },
            "& .MuiChip-deleteIcon": { fontSize: 10 },
            "& .MuiChip-label": { paddingLeft: 10, paddingRight: 10 },
          },
        },
        {
          props: { size: "xs" },
          style: {
            height: 24,
            fontSize: 12,
            borderRadius: 6,
            padding: 0,
            "& .MuiChip-icon": { fontSize: 12 },
            "& .MuiChip-deleteIcon": { fontSize: 12 },
            "& .MuiChip-label": { paddingLeft: 12, paddingRight: 12 },
          },
        },
        {
          props: { color: "disabled" },
          style: ({ theme }) => ({ color: theme.palette.text.disabled }),
        },
      ],
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
        fontSizeMedium: {
          fontSize: "1.25rem",
        },
        fontSizeSmall: {
          fontSize: "1rem",
        },
      },
      variants: [
        {
          props: { fontSize: "xs" },
          style: { fontSize: "0.875rem" },
        },
      ],
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
  typography: {
    caption: { fontWeight: 300 },
  },
});
