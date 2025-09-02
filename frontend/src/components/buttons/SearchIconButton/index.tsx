import { IconButton, type IconButtonProps } from "@mui/material";
import { Search } from "@mui/icons-material";

const SearchIconButton = (props: IconButtonProps) => {
  return (
    <IconButton {...props}>
      <Search />
    </IconButton>
  );
};

export default SearchIconButton;
