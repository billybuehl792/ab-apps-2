import { type ReactNode, type ComponentProps } from "react";
import { useMediaQuery, type MenuProps } from "@mui/material";
import MenuOptionListDrawer from "../MenuOptionDrawer";
import MenuOptionListMenu from "../MenuOptionMenu";

export interface MenuOptions {
  title?: ReactNode;
  options: MenuOption[];
  disableCloseOnSelect?: boolean;
  variant?: "drawer" | "menu";
}

interface MenuOptionModalProps extends MenuOptions {
  anchorEl?: MenuProps["anchorEl"];
  open: boolean;
  onClose: VoidFunction;
  onTransitionExited?: VoidFunction;
  slotProps?: {
    drawer?: Partial<ComponentProps<typeof MenuOptionListDrawer>>;
    menu?: Partial<ComponentProps<typeof MenuOptionListMenu>>;
  };
}

/**
 * This component renders either `MenuOptionMenu` (desktop) or a
 * `MenuOptionDrawer` (mobile) with a list of selectable options.
 */
const MenuOptionModal = ({
  anchorEl,
  open,
  options,
  disableCloseOnSelect,
  title = "Options",
  variant,
  onClose,
  onTransitionExited,
  slotProps,
}: MenuOptionModalProps) => {
  /** Values */

  const isTouch = useMediaQuery("(pointer: coarse)");
  const asMenu = variant === "menu" || !isTouch;

  return asMenu ? (
    <MenuOptionListMenu
      anchorEl={anchorEl}
      open={open}
      options={options}
      disableCloseOnSelect={disableCloseOnSelect}
      onClose={onClose}
      onTransitionExited={onTransitionExited}
      {...slotProps?.menu}
    />
  ) : (
    <MenuOptionListDrawer
      title={title}
      open={open}
      options={options}
      disableCloseOnSelect={disableCloseOnSelect}
      onClose={onClose}
      onTransitionExited={onTransitionExited}
      {...slotProps?.drawer}
    />
  );
};

export default MenuOptionModal;
