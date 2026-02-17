import { type MouseEvent, type ReactEventHandler } from "react";
import { Menu, type MenuProps } from "@mui/material";
import MenuOptionMenuItem from "@/components/buttons/MenuOptionMenuItem";

export interface IMenuOptionMenuProps<
  TOptions extends IMenuOption[] = IMenuOption[],
> extends Omit<MenuProps, "onSelect" | "onClose"> {
  options: TOptions;
  disableCloseOnSelect?: boolean;
  onSelect?: (option: TOptions[number], event: MouseEvent<HTMLElement>) => void;
  onClose: ReactEventHandler<HTMLElement>;
}

const MenuOptionMenu = <TOptions extends IMenuOption[] = IMenuOption[]>({
  options,
  disableCloseOnSelect,
  onSelect,
  onClose,
  ...props
}: IMenuOptionMenuProps<TOptions>) => {
  return (
    <Menu id="menu" component="div" onClose={onClose} {...props}>
      {options
        .filter(({ render }) => render !== false)
        .map((option) => (
          <MenuOptionMenuItem
            key={option.id}
            option={option}
            onClick={(event) => {
              onSelect?.(option, event);
              if (!disableCloseOnSelect) onClose(event);
            }}
          />
        ))}
    </Menu>
  );
};

export default MenuOptionMenu;
