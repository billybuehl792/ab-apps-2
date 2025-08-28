import { IconButton, type IconButtonProps } from "@mui/material";
import { MoreVert } from "@mui/icons-material";
import useMenu from "@/store/hooks/useMenu";
import { type MenuOptions } from "@/components/modals/MenuOptionModal";

type MenuOptionIconButtonProps = IconButtonProps & MenuOptions;

const MenuOptionIconButton = ({
  title,
  options,
  disableCloseOnSelect,
  variant,
  ...props
}: MenuOptionIconButtonProps) => {
  /** Values */

  const menu = useMenu();

  /** Callbacks */

  const handleOpen: IconButtonProps["onClick"] = (event) => {
    menu.open({ title, options, disableCloseOnSelect, variant }, event);
  };

  return (
    <IconButton component="span" onClick={handleOpen} {...props}>
      <MoreVert />
    </IconButton>
  );
};

export default MenuOptionIconButton;
