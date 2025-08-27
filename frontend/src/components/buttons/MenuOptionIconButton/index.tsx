import { useState } from "react";
import { IconButton, type IconButtonProps } from "@mui/material";
import { MoreVert } from "@mui/icons-material";
import MenuOptionModal from "@/components/modals/MenuOptionModal";

interface MenuOptionIconButtonProps extends IconButtonProps {
  options: MenuOption[];
}

const MenuOptionIconButton = ({
  options,
  ...props
}: MenuOptionIconButtonProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  /** Values */

  /** Callbacks */

  const handleOpen: IconButtonProps["onClick"] = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <IconButton component="span" onClick={handleOpen} {...props}>
        <MoreVert />
      </IconButton>
      <MenuOptionModal
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        options={options}
        onClose={handleClose}
      />
    </>
  );
};

export default MenuOptionIconButton;
