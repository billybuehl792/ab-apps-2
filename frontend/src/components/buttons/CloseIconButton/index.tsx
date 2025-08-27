import { IconButton, type IconButtonProps } from "@mui/material";
import { Close } from "@mui/icons-material";

const CloseIconButton = (props: IconButtonProps) => {
  return (
    <IconButton {...props}>
      <Close />
    </IconButton>
  );
};

export default CloseIconButton;
