import { useNavigate } from "@tanstack/react-router";
import { Menu, type MenuProps } from "@mui/material";
import MenuOptionMenuItem from "@/components/menu-items/MenuOptionMenuItem";
import { theme } from "@/store/config/theme";

interface MenuOptionMenuProps extends Omit<MenuProps, "slotProps"> {
  options: MenuOption[];
  disableCloseOnSelect?: boolean;
  onClose?: VoidFunction;
}

const MenuOptionMenu = ({
  options,
  disableCloseOnSelect,
  onClose,
  ...props
}: MenuOptionMenuProps) => {
  /** Values */

  const navigate = useNavigate();

  /** Callbacks */

  const handleMenuItemClicked = (option: MenuOption) => {
    if (option.link) void navigate(option.link);
    else if (option.onClick) option.onClick();
  };

  return (
    <Menu id="menu" component="div" onClose={onClose} {...props}>
      {options
        .filter(({ render }) => render !== false)
        .map(({ link, onClick, ...option }) => (
          <MenuOptionMenuItem
            key={option.id}
            option={option}
            onClick={() => {
              if (!disableCloseOnSelect || !option.disableCloseOnSelect) {
                onClose?.();
                setTimeout(() => {
                  handleMenuItemClicked({ link, onClick, ...option });
                }, theme.transitions.duration.leavingScreen);
              } else handleMenuItemClicked({ link, onClick, ...option });
            }}
          />
        ))}
    </Menu>
  );
};

export default MenuOptionMenu;
