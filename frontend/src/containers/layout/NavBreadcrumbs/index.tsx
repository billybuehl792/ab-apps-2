import {
  type MouseEventHandler,
  useState,
  type ComponentProps,
  type ComponentType,
} from "react";
import { useMatches } from "@tanstack/react-router";
import {
  Breadcrumbs,
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
  slotProps: { crumb: crumbProps, ...slotProps } = {},
  ...props
}) => {
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const [menuCrumbs, setMenuCrumbs] = useState<
    { id: string; Component: ComponentType }[]
  >([]);

  /** Values */

  const crumbs = useMatches({
    select: (matches) =>
      matches.map((m) => m.staticData?.crumb).filter((c) => !!c),
  });

  const isSm = useMediaQuery(theme.breakpoints.down("sm"));
  const maxCrumbs = isSm ? 1 : 2;

  /** Callbacks */

  const handleOnMenuOpen: MouseEventHandler = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setMenuCrumbs(crumbs.slice(0, crumbs.length - maxCrumbs));
  };

  const handleOnMenuClose = () => {
    setAnchorEl(null);
    setTimeout(
      () => setMenuCrumbs([]),
      theme.transitions.duration.leavingScreen,
    );
  };

  return (
    <>
      <Breadcrumbs
        maxItems={maxCrumbs}
        itemsBeforeCollapse={0}
        itemsAfterCollapse={maxCrumbs}
        slotProps={{
          ...slotProps,
          collapsedIcon: { onClick: handleOnMenuOpen },
        }}
        sx={[
          {
            overflowX: "auto",
            "& .MuiBreadcrumbs-ol": { flexWrap: "nowrap" },
          },
          ...sxUtils.asArray(props?.sx),
        ]}
        {...props}
      >
        {crumbs.map(({ id, Component }) => (
          <Component key={id} />
        ))}
      </Breadcrumbs>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleOnMenuClose}
      >
        {menuCrumbs.map(({ id, Component }) => (
          <MenuItem
            key={id}
            onClick={handleOnMenuClose}
            sx={{ p: 0, "> a": { p: 1 } }}
          >
            <Component />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default NavBreadcrumbs;
