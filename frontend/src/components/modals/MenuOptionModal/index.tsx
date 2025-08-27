import { type ReactNode, type ComponentProps } from "react";
import { useMediaQuery, type MenuProps } from "@mui/material";
import MenuOptionListDrawer from "../MenuOptionDrawer";
import MenuOptionListMenu from "../MenuOptionMenu";

interface MenuOptionModalProps {
  anchorEl?: MenuProps["anchorEl"];
  open: boolean;
  options: MenuOption[];
  disableCloseOnSelect?: boolean;
  title?: ReactNode;
  onClose: VoidFunction;
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
  onClose,
  slotProps,
}: MenuOptionModalProps) => {
  /** Values */

  const isTouch = useMediaQuery("(pointer: coarse)");

  return isTouch ? (
    <MenuOptionListDrawer
      title={title}
      open={open}
      options={options}
      disableCloseOnSelect={disableCloseOnSelect}
      onClose={onClose}
      {...slotProps?.drawer}
    />
  ) : (
    <MenuOptionListMenu
      anchorEl={anchorEl}
      open={open}
      options={options}
      disableCloseOnSelect={disableCloseOnSelect}
      onClose={onClose}
      {...slotProps?.menu}
    />
  );
};

export default MenuOptionModal;
