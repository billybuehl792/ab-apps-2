import { type ReactNode, useState } from "react";
import { IconButton, type IconButtonProps } from "@mui/material";
import { MoreVert } from "@mui/icons-material";
import MenuOptionMenu, {
  type IMenuOptionMenuProps,
} from "@/components/modals/MenuOptionMenu";

export interface IMenuOptionIconButtonProps<
  TOptions extends IMenuOption[] = IMenuOption[],
>
  extends
    Omit<IconButtonProps, "children" | "onSelect">,
    Pick<
      IMenuOptionMenuProps<TOptions>,
      "options" | "disableCloseOnSelect" | "onSelect"
    > {
  icon?: ReactNode;
  slotProps?: {
    menu?: Partial<IMenuOptionMenuProps<TOptions>>;
  };
}

const MenuOptionIconButton = <TOptions extends IMenuOption[] = IMenuOption[]>({
  title,
  options,
  icon,
  disableCloseOnSelect,
  onSelect,
  onClick,
  slotProps,
  ...props
}: IMenuOptionIconButtonProps<TOptions>) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  /** Values */

  const open = Boolean(anchorEl);

  /** Callbacks */

  const handleOnClick: IconButtonProps["onClick"] = (event) => {
    onClick?.(event);
    setAnchorEl(event.currentTarget);
  };

  const handleClose: IMenuOptionMenuProps<TOptions>["onClose"] = (event) => {
    slotProps?.menu?.onClose?.(event);
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        {...(open && { "aria-selected": "true" })}
        onClick={handleOnClick}
        {...props}
      >
        {icon ?? <MoreVert />}
      </IconButton>
      <MenuOptionMenu
        open={open}
        anchorEl={anchorEl}
        options={options}
        disableCloseOnSelect={disableCloseOnSelect}
        onSelect={onSelect}
        {...slotProps?.menu}
        onClose={handleClose}
      />
    </>
  );
};

export default MenuOptionIconButton;
