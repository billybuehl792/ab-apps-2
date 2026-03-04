import { type ReactNode, useState } from "react";
import { IconButton, type IconButtonProps } from "@mui/material";
import { MoreVert, SvgIconComponent } from "@mui/icons-material";
import MenuOptionMenu, {
  type IMenuOptionMenuProps,
} from "@/components/modals/MenuOptionMenu";

export interface IMenuOptionIconButtonProps<
  TOptions extends IMenuOption[] = IMenuOption[],
>
  extends
    Omit<IconButtonProps, "children" | "onChange" | "onSelect">,
    Pick<
      IMenuOptionMenuProps<TOptions>,
      "options" | "hideOptions" | "disableCloseOnSelect" | "onSelect"
    > {
  icon?: ReactNode;
  Icon?: SvgIconComponent;
  loading?: boolean;
  slotProps?: {
    menu?: Partial<IMenuOptionMenuProps<TOptions>>;
  };
}

const MenuOptionIconButton = <TOptions extends IMenuOption[] = IMenuOption[]>({
  title,
  options,
  hideOptions,
  icon,
  Icon,
  disabled,
  loading,
  disableCloseOnSelect,
  onSelect,
  onClick,
  slotProps,
  ...props
}: IMenuOptionIconButtonProps<TOptions>) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  /** Values */

  const open = Boolean(anchorEl) && !disabled && !loading;

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
        disabled={disabled || loading}
        onClick={handleOnClick}
        {...props}
      >
        {Icon ? <Icon /> : icon ? icon : <MoreVert />}
      </IconButton>
      <MenuOptionMenu
        open={open}
        anchorEl={anchorEl}
        options={options}
        hideOptions={hideOptions}
        disableCloseOnSelect={disableCloseOnSelect}
        onSelect={onSelect}
        {...slotProps?.menu}
        onClose={handleClose}
      />
    </>
  );
};

export default MenuOptionIconButton;
