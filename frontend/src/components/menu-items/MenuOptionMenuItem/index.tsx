import { Link } from "@tanstack/react-router";
import {
  ListItemIcon,
  ListItemText,
  MenuItem,
  type MenuItemProps,
} from "@mui/material";
import { sxUtils } from "@/store/utils/sx";

interface MenuOptionMenuItemProps extends MenuItemProps {
  option: MenuOption;
}

const MenuOptionMenuItem = ({ option, ...props }: MenuOptionMenuItemProps) => {
  /** Values */

  const color = option.color ? `${option.color}.main` : undefined;

  return (
    <MenuItem
      selected={option.selected}
      disabled={option.disabled}
      onClick={option.onClick}
      {...(!!option.link && { component: Link, ...option.link })}
      {...props}
      sx={[{ color }, ...sxUtils.asArray(props.sx)]}
    >
      {!!option.icon && (
        <ListItemIcon sx={{ svg: { color } }}>{option.icon}</ListItemIcon>
      )}
      <ListItemText primary={option.label} secondary={option.description} />
    </MenuItem>
  );
};

export default MenuOptionMenuItem;
