import {
  type ReactNode,
  type ComponentProps,
  type SyntheticEvent,
  type ReactEventHandler,
} from "react";
import { useMediaQuery, type MenuProps } from "@mui/material";
import MenuOptionListDrawer from "../MenuOptionDrawer";
import MenuOptionListMenu from "../MenuOptionMenu";

export interface IMenuOptionModalProps<
  T extends IMenuOption[] = IMenuOption[],
> {
  open: boolean;
  options: T;
  title?: ReactNode;
  anchorEl?: MenuProps["anchorEl"];
  variant?: "menu" | "drawer";
  disableCloseOnSelect?: boolean;
  onSelect?: (option: T[number], event: SyntheticEvent<HTMLElement>) => void;
  onClose: ReactEventHandler;
  onTransitionExited?: VoidFunction;
  slotProps?: {
    drawer?: Partial<ComponentProps<typeof MenuOptionListDrawer<T>>>;
    menu?: Partial<ComponentProps<typeof MenuOptionListMenu<T>>>;
  };
}

/**
 * This component renders either `MenuOptionMenu` (desktop) or a
 * `MenuOptionDrawer` (mobile) with a list of selectable options.
 */
const MenuOptionModal = <T extends IMenuOption[] = IMenuOption[]>({
  open,
  options,
  title = "Options",
  anchorEl,
  variant,
  disableCloseOnSelect,
  onSelect,
  onClose,
  onTransitionExited,
  slotProps,
}: IMenuOptionModalProps<T>) => {
  /** Values */

  const isTouch = useMediaQuery("(pointer: coarse)");
  const asMenu = variant === "menu" || !isTouch;

  return asMenu ? (
    <MenuOptionListMenu
      anchorEl={anchorEl}
      open={open}
      options={options}
      disableCloseOnSelect={disableCloseOnSelect}
      onSelect={onSelect}
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
      onSelect={onSelect}
      onClose={onClose}
      onTransitionExited={onTransitionExited}
      {...slotProps?.drawer}
    />
  );
};

export default MenuOptionModal;
