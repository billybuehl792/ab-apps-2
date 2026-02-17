import { type ComponentProps, Fragment, useMemo } from "react";
import MenuItemLink from "@/components/links/MenuItemLink";
import {
  ListItemIcon,
  ListItemText,
  MenuItem,
  type MenuItemProps,
} from "@mui/material";
import { sxUtils } from "@/store/utils/sx";

type IMenuOptionMenuItemProps<TOption extends IMenuOption> = {
  option: TOption;
} & (TOption["link"] extends never
  ? MenuItemProps
  : ComponentProps<typeof MenuItemLink>);

const MenuOptionMenuItem = <TOption extends IMenuOption>({
  option,
  onClick,
  ...props
}: IMenuOptionMenuItemProps<TOption>) => {
  /** Callbacks */

  const handleOnClick: MenuItemProps["onClick"] = (event) => {
    onClick?.(event);
    option.onClick?.();
  };

  /** Components */

  const Content = useMemo(
    () => (
      <Fragment>
        {!!option.icon && (
          <ListItemIcon sx={{ color: option.color }}>
            {option.icon}
          </ListItemIcon>
        )}
        <ListItemText
          primary={option.label}
          secondary={option.description}
          sx={{ color: option.color }}
        />
      </Fragment>
    ),
    [option],
  );

  if (option.link)
    return (
      <MenuItemLink
        {...option.link}
        selected={option.selected}
        disabled={option.disabled}
        onClick={handleOnClick}
        {...(props as ComponentProps<typeof MenuItemLink>)}
        sx={[...sxUtils.asArray(option.sx), ...sxUtils.asArray(props?.sx)]}
      >
        {Content}
      </MenuItemLink>
    );
  return (
    <MenuItem
      selected={option.selected}
      disabled={option.disabled}
      onClick={handleOnClick}
      {...(props as MenuItemProps)}
      sx={[...sxUtils.asArray(option.sx), ...sxUtils.asArray(props?.sx)]}
    >
      {Content}
    </MenuItem>
  );
};

export default MenuOptionMenuItem;
