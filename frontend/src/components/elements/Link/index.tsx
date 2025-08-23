import { type ReactNode } from "react";
import {
  Link as TanstackLink,
  type LinkComponentProps,
  useLocation,
} from "@tanstack/react-router";
import { Link as MuiLink, type LinkProps as MuiLinkProps } from "@mui/material";

interface LinkProps
  extends Omit<LinkComponentProps, "children" | "color">,
    Omit<MuiLinkProps, "href" | "target"> {
  label: ReactNode;
}

const Link = ({ label, ...props }: LinkProps) => {
  /** Values */

  const location = useLocation();
  const isActive = props.to === location.pathname;

  return (
    <MuiLink
      component={TanstackLink}
      variant="body2"
      fontWeight={isActive ? 600 : 200}
      disabled={isActive}
      underline="none"
      {...props}
    >
      {label}
    </MuiLink>
  );
};

export default Link;
