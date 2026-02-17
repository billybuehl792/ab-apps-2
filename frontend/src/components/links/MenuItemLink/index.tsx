import React from "react";
import { createLink } from "@tanstack/react-router";
import { MenuItem, type MenuItemProps } from "@mui/material";
import type { LinkComponent } from "@tanstack/react-router";

const MenuItemLinkComponent = React.forwardRef<
  HTMLAnchorElement,
  MenuItemProps
>((props, ref) => <MenuItem ref={ref} component="a" {...props} />);

const CreatedMenuItemLinkComponent = createLink(MenuItemLinkComponent);

const MenuItemLink: LinkComponent<typeof CreatedMenuItemLinkComponent> = (
  props,
) => {
  return <CreatedMenuItemLinkComponent {...props} />;
};

export default MenuItemLink;
