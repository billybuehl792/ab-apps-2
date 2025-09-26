import { forwardRef, type ReactNode } from "react";
import { createLink, type LinkComponent } from "@tanstack/react-router";
import { Link as MuiLink, type LinkProps as MuiLinkProps } from "@mui/material";
import { type SvgIconComponent } from "@mui/icons-material";

interface MUILinkComponentProps extends MuiLinkProps {
  label: ReactNode;
  active?: boolean;
  Icon?: SvgIconComponent;
}

const MUILinkComponent = forwardRef<HTMLAnchorElement, MUILinkComponentProps>(
  ({ label, active, Icon, ...props }, ref) => {
    return (
      <MuiLink
        ref={ref}
        variant="body2"
        underline="none"
        display="flex"
        alignItems="center"
        gap={1}
        {...props}
      >
        {Icon && <Icon fontSize="inherit" />}
        {label}
      </MuiLink>
    );
  }
);

const CreatedLinkComponent = createLink(MUILinkComponent);

const CustomLink: LinkComponent<typeof MUILinkComponent> = (props) => {
  return <CreatedLinkComponent {...props} />;
};

export default CustomLink;
