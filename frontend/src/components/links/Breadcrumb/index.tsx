import React from "react";
import { createLink, type LinkComponent } from "@tanstack/react-router";
import { Button, type ButtonProps } from "@mui/material";

const BreadcrumbComponent = React.forwardRef<HTMLAnchorElement, ButtonProps>(
  (props, ref) => <Button ref={ref} component="a" {...props} />,
);

const CreatedBreadcrumbComponent = createLink(BreadcrumbComponent);

const Breadcrumb: LinkComponent<typeof CreatedBreadcrumbComponent> = (
  props,
) => {
  return (
    <CreatedBreadcrumbComponent
      variant="text"
      size="small"
      color="inherit"
      activeOptions={{ exact: true, includeSearch: false }}
      activeProps={{ className: "Mui-selected", color: "primary" }}
      {...props}
    />
  );
};

export default Breadcrumb;
