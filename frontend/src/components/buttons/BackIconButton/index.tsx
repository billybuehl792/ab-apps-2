import { IconButton, type IconButtonProps } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";

const BackIconButton = (props: IconButtonProps) => {
  return (
    <IconButton {...props}>
      <ArrowBack />
    </IconButton>
  );
};

export default BackIconButton;
