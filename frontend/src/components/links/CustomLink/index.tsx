import { forwardRef, type ReactNode } from "react";
import { createLink, type LinkComponent } from "@tanstack/react-router";
import { Link as MuiLink, type LinkProps as MuiLinkProps } from "@mui/material";

interface MUILinkComponentProps extends MuiLinkProps {
  label: ReactNode;
  active?: boolean;
  icon?: ReactNode;
}

const MUILinkComponent = forwardRef<HTMLAnchorElement, MUILinkComponentProps>(
  ({ label, icon, active, ...props }, ref) => {
    return (
      <MuiLink
        ref={ref}
        variant="body2"
        display="flex"
        underline="hover"
        alignItems="center"
        gap={1}
        {...props}
      >
        {icon}
        {label}
      </MuiLink>
    );
  },
);

const CreatedLinkComponent = createLink(MUILinkComponent);

const CustomLink: LinkComponent<typeof MUILinkComponent> = (props) => {
  return <CreatedLinkComponent {...props} />;
};

export default CustomLink;
