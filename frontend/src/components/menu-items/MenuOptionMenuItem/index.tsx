import {
  ListItemIcon,
  ListItemText,
  MenuItem,
  type MenuItemProps,
} from "@mui/material";

interface MenuOptionMenuItemProps extends MenuItemProps {
  option: MenuOption;
}

const MenuOptionMenuItem = ({ option, ...props }: MenuOptionMenuItemProps) => {
  /** Values */

  const color = option.color ? `${option.color}.main` : undefined;
  const Icon = option.Icon;

  return (
    <MenuItem
      selected={option.selected}
      disabled={option.disabled}
      onClick={option.onClick}
      {...props}
    >
      {!!Icon && (
        <ListItemIcon sx={{ color }}>
          <Icon />
        </ListItemIcon>
      )}
      <ListItemText
        primary={option.label}
        secondary={option.description}
        sx={{ color }}
      />
    </MenuItem>
  );
};

export default MenuOptionMenuItem;
