import React from "react";
import { createLink } from "@tanstack/react-router";
import { Button, type ButtonProps } from "@mui/material";
import type { LinkComponent } from "@tanstack/react-router";

const ButtonLinkComponent = React.forwardRef<HTMLAnchorElement, ButtonProps>(
  (props, ref) => <Button ref={ref} component="a" {...props} />,
);

const CreatedButtonLinkComponent = createLink(ButtonLinkComponent);

const ButtonLink: LinkComponent<typeof CreatedButtonLinkComponent> = (
  props,
) => {
  return <CreatedButtonLinkComponent {...props} />;
};

export default ButtonLink;
