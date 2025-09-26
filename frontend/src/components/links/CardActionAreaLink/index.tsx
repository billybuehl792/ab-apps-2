import React from "react";
import { createLink } from "@tanstack/react-router";
import { CardActionArea, type CardActionAreaProps } from "@mui/material";
import type { LinkComponent } from "@tanstack/react-router";

const CardActionAreaLinkComponent = React.forwardRef<
  HTMLAnchorElement,
  CardActionAreaProps
>((props, ref) => <CardActionArea ref={ref} component="a" {...props} />);

const CreatedCardActionAreaLinkComponent = createLink(
  CardActionAreaLinkComponent
);

const CardActionAreaLink: LinkComponent<
  typeof CreatedCardActionAreaLinkComponent
> = (props) => {
  return <CreatedCardActionAreaLinkComponent {...props} />;
};

export default CardActionAreaLink;
