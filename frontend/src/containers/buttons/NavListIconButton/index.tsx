import React, { useEffect, useState } from "react";
import { useLocation } from "@tanstack/react-router";
import { IconButton, useMediaQuery, type IconButtonProps } from "@mui/material";
import { Menu, MenuOpen } from "@mui/icons-material";
import Drawer, { type IDrawerProps } from "@/components/modals/Drawer";
import NavList from "@/containers/lists/NavList";

export interface INavListIconButtonProps extends IconButtonProps {
  slotProps?: {
    drawer?: IDrawerProps;
  };
}

const NavListIconButton: React.FC<INavListIconButtonProps> = ({
  slotProps,
  ...props
}) => {
  const [open, setOpen] = useState(false);

  /** Values */

  const location = useLocation();
  const isMobile = useMediaQuery(({ breakpoints }) => breakpoints.down("sm"));

  /** Callbacks */

  const handleOnOpen = () => setOpen(true);

  const handleOnClose = () => setOpen(false);

  /** Effects */

  useEffect(() => {
    setOpen(false);
  }, [location.pathname, isMobile]);

  return (
    <>
      <IconButton
        color="inherit"
        onClick={() => (open ? handleOnClose() : handleOnOpen())}
        {...props}
      >
        {open ? <MenuOpen /> : <Menu />}
      </IconButton>
      <Drawer
        title="AB Apps"
        anchor="left"
        fullHeight
        open={open}
        onClose={handleOnClose}
        {...slotProps?.drawer}
      >
        <NavList />
      </Drawer>
    </>
  );
};

export default NavListIconButton;
