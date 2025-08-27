import { type ComponentProps } from "react";
import { useNavigate } from "@tanstack/react-router";
import { MenuList, useMediaQuery } from "@mui/material";
import MenuOptionMenuItem from "@/components/menu-items/MenuOptionMenuItem";
import Drawer from "@/components/modals/Drawer";
import { theme } from "@/store/config/theme";

interface MenuOptionDrawerProps extends Partial<ComponentProps<typeof Drawer>> {
  options: MenuOption[];
  disableCloseOnSelect?: boolean;
}

const MenuOptionDrawer = ({
  options,
  disableCloseOnSelect,
  onClose,
  ...props
}: MenuOptionDrawerProps) => {
  /** Values */

  const isSm = useMediaQuery((theme) => theme.breakpoints.up("sm"));
  const navigate = useNavigate();

  /** Callbacks */

  const handleMenuItemClicked = (option: MenuOption) => {
    if (option.link) void navigate(option.link);
    else if (option.onClick) option.onClick();
  };

  return (
    <Drawer
      title="Options"
      anchor={isSm ? "right" : "bottom"}
      onClose={onClose}
      {...props}
    >
      <MenuList sx={{ minWidth: 300 }}>
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
      </MenuList>
    </Drawer>
  );
};

export default MenuOptionDrawer;
