import { type ReactNode } from "react";
import {
  Link as TanstackLink,
  type LinkComponentProps,
  useLocation,
} from "@tanstack/react-router";
import { Link as MuiLink, type LinkProps as MuiLinkProps } from "@mui/material";
import { sxUtils } from "@/store/utils/sx";

interface LinkProps
  extends Omit<LinkComponentProps, "children" | "color">,
    Omit<MuiLinkProps, "href" | "target"> {
  label: ReactNode;
  active?: boolean;
  icon?: ReactNode;
}

const Link = ({ label, active, icon, sx, ...props }: LinkProps) => {
  /** Values */

  const location = useLocation();
  const isActive = active || props.to === location.pathname;

  /** Components */

  const BaseLink = (
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
      {icon}
      {label}
    </MuiLink>
  );

  return BaseLink;
};

export default Link;
