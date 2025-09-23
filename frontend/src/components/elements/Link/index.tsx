import { type ReactNode } from "react";
import {
  Link as TanstackLink,
  type LinkComponentProps,
  useLocation,
} from "@tanstack/react-router";
import { Link as MuiLink, type LinkProps as MuiLinkProps } from "@mui/material";
import { type SvgIconComponent } from "@mui/icons-material";
import { sxUtils } from "@/store/utils/sx";

interface LinkProps
  extends Omit<LinkComponentProps, "children" | "color">,
    Omit<MuiLinkProps, "href" | "target"> {
  label: ReactNode;
  active?: boolean;
  Icon?: SvgIconComponent;
}

const Link = ({ label, active, Icon, sx, ...props }: LinkProps) => {
  /** Values */

  const location = useLocation();
  const isActive = active || props.to === location.pathname;

  /** Components */

  return (
    <MuiLink
      component={TanstackLink}
      variant="body2"
      fontWeight={isActive ? 600 : 200}
      disabled={isActive}
      underline="none"
      sx={[
        { display: "flex", alignItems: "center", gap: 1 },
        ...sxUtils.asArray(sx),
      ]}
      {...props}
    >
      {Icon && <Icon fontSize="inherit" />}
      {label}
    </MuiLink>
  );
};

export default Link;
