import React from "react";
import { createLink } from "@tanstack/react-router";
import { ListItemButton, type ListItemButtonProps } from "@mui/material";
import type { LinkComponent } from "@tanstack/react-router";

const ListItemButtonLinkComponent = React.forwardRef<
  HTMLAnchorElement,
  ListItemButtonProps
>((props, ref) => <ListItemButton ref={ref} component="a" {...props} />);

const CreatedListItemButtonLinkComponent = createLink(
  ListItemButtonLinkComponent,
);

const ListItemButtonLink: LinkComponent<
  typeof CreatedListItemButtonLinkComponent
> = (props) => {
  return <CreatedListItemButtonLinkComponent {...props} />;
};

export default ListItemButtonLink;
