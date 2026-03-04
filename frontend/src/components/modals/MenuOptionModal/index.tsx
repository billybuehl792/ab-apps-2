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
  TOptions extends IMenuOption[] = IMenuOption[],
> {
  open: boolean;
  options: TOptions;
  title?: ReactNode;
  anchorEl?: MenuProps["anchorEl"];
  variant?: "menu" | "drawer";
  disableCloseOnSelect?: boolean;
  hideOptions?: TOptions[number]["id"][];
  onSelect?: (
    option: TOptions[number],
    event: SyntheticEvent<HTMLElement>,
  ) => void;
  onClose: ReactEventHandler;
  onTransitionExited?: VoidFunction;
  slotProps?: {
    drawer?: Partial<ComponentProps<typeof MenuOptionListDrawer<TOptions>>>;
    menu?: Partial<ComponentProps<typeof MenuOptionListMenu<TOptions>>>;
  };
}

/**
 * This component renders either `MenuOptionMenu` (desktop) or a
 * `MenuOptionDrawer` (mobile) with a list of selectable options.
 */
const MenuOptionModal = <TOptions extends IMenuOption[] = IMenuOption[]>({
  open,
  options,
  title = "Options",
  anchorEl,
  variant,
  disableCloseOnSelect,
  hideOptions,
  onSelect,
  onClose,
  onTransitionExited,
  slotProps,
}: IMenuOptionModalProps<TOptions>) => {
  /** Values */

  const isTouch = useMediaQuery("(pointer: coarse)");
  const asMenu = variant === "menu" || !isTouch;

  return asMenu ? (
    <MenuOptionListMenu
      anchorEl={anchorEl}
      open={open}
      options={options}
      hideOptions={hideOptions}
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
      hideOptions={hideOptions}
      disableCloseOnSelect={disableCloseOnSelect}
      onSelect={onSelect}
      onClose={onClose}
      onTransitionExited={onTransitionExited}
      {...slotProps?.drawer}
    />
  );
};

export default MenuOptionModal;
