import { type ComponentProps, type MouseEvent } from "react";
import { MenuList, useMediaQuery } from "@mui/material";
import Drawer from "@/components/modals/Drawer";
import MenuOptionMenuItem from "@/components/buttons/MenuOptionMenuItem";

interface MenuOptionDrawerProps<
  TOptions extends IMenuOption[] = IMenuOption[],
> extends Omit<ComponentProps<typeof Drawer>, "children" | "onSelect"> {
  options: TOptions;
  hideOptions?: TOptions[number]["id"][];
  disableCloseOnSelect?: boolean;
  onSelect?: (option: TOptions[number], event: MouseEvent<HTMLElement>) => void;
}

const MenuOptionDrawer = <TOptions extends IMenuOption[] = IMenuOption[]>({
  title = "Options",
  options,
  hideOptions,
  disableCloseOnSelect,
  onSelect,
  onClose,
  ...props
}: MenuOptionDrawerProps<TOptions>) => {
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
          .filter(
            ({ render, id }) => render !== false && !hideOptions?.includes(id),
          )
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
      </MenuList>
    </Drawer>
  );
};

export default MenuOptionDrawer;
