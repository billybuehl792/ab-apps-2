import { type ComponentProps } from "react";
import { MenuList, useMediaQuery } from "@mui/material";
import MenuOptionMenuItem from "@/components/menu-items/MenuOptionMenuItem";
import Drawer from "@/components/modals/Drawer";
import type { MenuOptions } from "../MenuOptionModal";
import { theme } from "@/store/config/theme";

type MenuOptionDrawerProps = Partial<ComponentProps<typeof Drawer>> &
  Omit<MenuOptions, "variant">;

const MenuOptionDrawer = ({
  title = "Options",
  options,
  disableCloseOnSelect,
  onClose,
  ...props
}: MenuOptionDrawerProps) => {
  /** Values */

  const isSm = useMediaQuery((theme) => theme.breakpoints.up("sm"));

  return (
    <Drawer
      title={title}
      anchor={isSm ? "right" : "bottom"}
      onClose={onClose}
      {...props}
    >
      <MenuList sx={{ minWidth: 300 }}>
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
      </MenuList>
    </Drawer>
  );
};

export default MenuOptionDrawer;
