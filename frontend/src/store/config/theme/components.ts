import type { Components, CssVarsTheme, Theme } from "@mui/material";

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
    xxs: true;
  }
}

const components: Components<
  Omit<Theme, "palette" | "components"> & CssVarsTheme
> = {
  MuiAvatar: {
    defaultProps: {
      sx: {
        width: (theme) => theme.spacing(4),
        height: (theme) => theme.spacing(4),
        fontSize: (theme) => theme.typography.body1.fontSize,
      },
    },
  },
  MuiButton: { defaultProps: { variant: "outlined" } },
  MuiCard: {
    defaultProps: { variant: "outlined" },
    styleOverrides: {
      root: ({ theme, ownerState }) => ({
        '&[data-selected="true"]': {
          backgroundColor: theme.palette.action.selected,
          border:
            ownerState.variant === "outlined"
              ? `1px solid ${theme.palette.action.selected}`
              : undefined,
        },
        '&[data-disabled="true"]': {
          color: theme.palette.text.disabled,
          backgroundColor: theme.palette.action.disabledBackground,
          border:
            ownerState.variant === "outlined"
              ? `1px solid ${theme.palette.action.disabledBackground}`
              : undefined,
          boxShadow: ownerState.variant === "elevation" ? "none" : undefined,
        },
      }),
    },
  },
  MuiCardActions: {
    styleOverrides: { root: ({ theme }) => ({ padding: theme.spacing(2) }) },
  },
  MuiCardContent: {
    styleOverrides: {
      root: ({ theme }) => ({
        padding: theme.spacing(2),
        "&:last-child": { paddingBottom: theme.spacing(2) },
      }),
    },
  },
  MuiChip: {
    variants: [
      {
        props: { size: "xxs" },
        style: {
          height: 18,
          fontSize: 10,
          padding: 0,
          "& .MuiChip-icon": { fontSize: 10 },
          "& .MuiChip-deleteIcon": { fontSize: 10 },
          "& .MuiChip-label": { paddingLeft: 10, paddingRight: 10 },
        },
      },
      {
        props: { size: "xs" },
        style: ({ theme }) => ({
          height: theme.spacing(3),
          padding: 0,
          ...theme.typography.caption,
          "& .MuiChip-icon": { fontSize: 12 },
          "& .MuiChip-deleteIcon": { fontSize: 12 },
          "& .MuiChip-label": { paddingLeft: 12, paddingRight: 12 },
        }),
      },
      {
        props: { color: "disabled" },
        style: ({ theme }) => ({ color: theme.palette.text.disabled }),
      },
    ],
  },
  MuiDialogContent: { defaultProps: { dividers: true } },
  MuiIconButton: {
    variants: [
      {
        props: { "aria-selected": "true" },
        style: ({ theme }) => ({
          color: theme.palette.action.active,
          backgroundColor: theme.palette.action.selected,
        }),
      },
    ],
    styleOverrides: {
      root: {
        ["& .MuiSvgIcon-root"]: { fontSize: "inherit" },
      },
      sizeSmall: ({ theme }) => ({
        fontSize: "1.125rem",
        padding: theme.spacing(0.5),
      }),
      sizeMedium: ({ theme }) => ({
        fontSize: "1.25rem",
        padding: theme.spacing(0.75),
      }),
      sizeLarge: ({ theme }) => ({
        fontSize: "1.5rem",
        padding: theme.spacing(1),
      }),
    },
  },
  MuiLink: {
    styleOverrides: {
      root: ({ theme }) => ({
        position: "relative",
        "&:hover": { textDecoration: "none" },
        "::after": {
          content: "''",
          position: "absolute",
          left: 0,
          right: 0,
          bottom: "-2px",
          height: "2px",
          backgroundColor: "currentColor",
          opacity: 0,
          transform: "scaleX(0)",
          transition: theme.transitions.create(["opacity", "transform"]),
        },
        [`& .MuiSvgIcon-root`]: { fontSize: "inherit" },
      }),
      underlineHover: {
        "&:hover": {
          "&::after": {
            opacity: 1,
            transform: "scaleX(1)",
          },
        },
      },
    },
  },
  MuiListItemButton: {
    styleOverrides: {
      root: ({ theme }) => ({
        "&.Mui-selected, &[data-status='active']": {
          fontWeight: theme.typography.fontWeightBold,
          backgroundColor: theme.palette.action.selected,
          "&:hover": { backgroundColor: theme.palette.action.selected },
        },
      }),
    },
  },
  MuiSvgIcon: {
    styleOverrides: {
      fontSizeSmall: { fontSize: "1rem" },
      fontSizeMedium: { fontSize: "1.25rem" },
      fontSizeLarge: { fontSize: "2rem" },
    },
    variants: [
      {
        props: { fontSize: "xs" },
        style: { fontSize: "0.875rem" },
      },
      {
        props: { fontSize: "xxs" },
        style: { fontSize: "0.75rem" },
      },
    ],
  },
  MuiTextField: {
    defaultProps: { variant: "outlined" },
    styleOverrides: {
      root: {
        input: {
          "::-webkit-search-cancel-button": { WebkitAppearance: "none" },
        },
      },
    },
  },
  MuiTabs: {
    styleOverrides: {
      root: ({ theme }) => ({ minHeight: theme.spacing(2) }),
    },
  },
  MuiTab: {
    styleOverrides: {
      root: ({ theme }) => ({
        textTransform: "none",
        padding: theme.spacing(1.5),
        minHeight: theme.spacing(2),
      }),
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
};

export default components;
