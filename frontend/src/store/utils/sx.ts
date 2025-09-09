import { type SxProps, type Theme } from "@mui/material";

/**
 * Returns given sx props wrapped in an array not currently array.
 * Used to pass sx as props.
 *
 * https://mui.com/system/getting-started/the-sx-prop/#passing-the-sx-prop
 */
const asArray = (sx?: SxProps<Theme>) => {
  if (!sx) return [];
  return Array.isArray(sx) ? sx : [sx];
};

export const sxUtils = { asArray };
