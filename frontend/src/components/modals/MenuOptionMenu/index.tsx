import { Menu, type MenuProps } from "@mui/material";
import MenuOptionMenuItem from "@/components/menu-items/MenuOptionMenuItem";
import type { MenuOptions } from "../MenuOptionModal";
import { theme } from "@/store/config/theme";

interface MenuOptionMenuProps
  extends Omit<MenuProps, "slotProps" | "title">,
    Omit<MenuOptions, "title" | "variant"> {
  onClose?: VoidFunction;
}

const MenuOptionMenu = ({
  options,
  disableCloseOnSelect,
  onClose,
  ...props
}: MenuOptionMenuProps) => {
  return (
    <Menu id="menu" component="div" onClose={onClose} {...props}>
      {options
        .filter(({ render }) => render !== false)
        .map(({ onClick, ...option }) => (
          <MenuOptionMenuItem
            key={option.id}
            option={option}
            onClick={() => {
              if (disableCloseOnSelect || option.disableCloseOnSelect)
                onClick?.();
              else {
                onClose?.();
                setTimeout(
                  () => onClick?.(),
                  theme.transitions.duration.leavingScreen
                );
              }
            }}
          />
        ))}
    </Menu>
  );
};

export default MenuOptionMenu;
