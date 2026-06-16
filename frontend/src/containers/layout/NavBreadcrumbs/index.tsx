import { type MouseEventHandler, useState, type ComponentProps } from "react";
import { useLocation, useMatches, useNavigate } from "@tanstack/react-router";
import {
  Breadcrumbs,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  useMediaQuery,
  type BreadcrumbsProps,
} from "@mui/material";
import ButtonLink from "@/components/links/ButtonLink";
import theme from "@/store/config/theme";
import { sxUtils } from "@/store/utils/sx";

interface INavBreadcrumbProps extends Omit<
  BreadcrumbsProps,
  "maxItems" | "itemsBeforeCollapse" | "itemsAfterCollapse" | "slotProps"
> {
  slotProps?: {
    crumb?: ComponentProps<typeof ButtonLink>;
  } & BreadcrumbsProps["slotProps"];
}

const NavBreadcrumbs: React.FC<INavBreadcrumbProps> = ({
  sx,
  slotProps: { crumb: crumbProps, ...slotProps } = {},
  ...props
}) => {
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);

  /** Values */

  const location = useLocation();
  const navigate = useNavigate();
  const matches = useMatches();

  const isSm = useMediaQuery(theme.breakpoints.down("sm"));
  const maxCrumbs = isSm ? 1 : 2;
  const itemsAfterCollapse = isSm ? 1 : 2;

  const crumbs = matches
    .map((match) =>
      match.loaderData?.crumb
        ? { ...match.loaderData.crumb, pathname: match.pathname }
        : undefined,
    )
    .filter((crumb) => !!crumb);
  const menuCrumbs = crumbs.slice(0, crumbs.length - itemsAfterCollapse);

  /** Callbacks */

  const handleOnMenuOpen: MouseEventHandler = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleOnMenuClose = () => setAnchorEl(null);

  return (
    <>
      <Breadcrumbs
        maxItems={maxCrumbs}
        itemsBeforeCollapse={0}
        itemsAfterCollapse={itemsAfterCollapse}
        slotProps={{
          ...slotProps,
          collapsedIcon: { onClick: handleOnMenuOpen },
        }}
        sx={[
          {
            overflowX: "auto",
            "& .MuiBreadcrumbs-ol": { flexWrap: "nowrap" },
          },
          ...sxUtils.asArray(sx),
        ]}
        {...props}
      >
        {crumbs.map((crumb) => (
          <ButtonLink
            key={crumb.pathname}
            to={crumb.pathname}
            children={crumb.label}
            variant="text"
            size="small"
            color="inherit"
            activeOptions={{ exact: true, includeSearch: false }}
            activeProps={{ color: "primary" }}
            {...(crumb.Icon && { startIcon: <crumb.Icon /> })}
            {...crumbProps}
            sx={[{ whiteSpace: "nowrap" }, ...sxUtils.asArray(crumbProps?.sx)]}
          />
        ))}
      </Breadcrumbs>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleOnMenuClose}
      >
        {menuCrumbs.map((crumb) => (
          <MenuItem
            key={crumb.pathname}
            selected={location.pathname === crumb.pathname}
            onClick={() => {
              handleOnMenuClose();
              setTimeout(
                () => navigate({ to: crumb.pathname }),
                theme.transitions.duration.leavingScreen,
              );
            }}
          >
            {!!crumb.Icon && (
              <ListItemIcon>
                <crumb.Icon />
              </ListItemIcon>
            )}
            <ListItemText primary={crumb.label} />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default NavBreadcrumbs;
