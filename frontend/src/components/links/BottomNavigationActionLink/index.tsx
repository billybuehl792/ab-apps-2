import React from "react";
import { createLink } from "@tanstack/react-router";
import {
  BottomNavigationAction,
  type BottomNavigationActionProps,
} from "@mui/material";
import type { LinkComponent } from "@tanstack/react-router";

const BottomNavigationActionLinkComponent = React.forwardRef<
  HTMLAnchorElement,
  BottomNavigationActionProps
>((props, ref) => (
  <BottomNavigationAction ref={ref} component="a" {...props} />
));

const CreatedBottomNavigationActionLinkComponent = createLink(
  BottomNavigationActionLinkComponent,
);

const BottomNavigationActionLink: LinkComponent<
  typeof CreatedBottomNavigationActionLinkComponent
> = (props) => {
  return (
    <CreatedBottomNavigationActionLinkComponent
      activeProps={{
        className: "Mui-selected",
        slotProps: { label: { className: "Mui-selected" } },
      }}
      {...props}
    />
  );
};

export default BottomNavigationActionLink;
