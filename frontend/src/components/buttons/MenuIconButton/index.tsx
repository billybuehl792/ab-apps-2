import { useEffect, useState } from "react";
import { IconButton, type IconButtonProps } from "@mui/material";
import { Menu, MenuOpen } from "@mui/icons-material";

interface MenuIconButtonProps extends IconButtonProps {
  open?: boolean;
}

const MenuIconButton = ({
  open: openProp,
  children,
  ...props
}: MenuIconButtonProps) => {
  const [open, setOpen] = useState(!!openProp);

  /** Effects */

  useEffect(() => {
    setOpen(!!openProp);
  }, [openProp]);

  return (
    <IconButton {...props}>
      {children ?? (open ? <MenuOpen /> : <Menu />)}
    </IconButton>
  );
};

export default MenuIconButton;
