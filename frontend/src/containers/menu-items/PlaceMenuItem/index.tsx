import {
  ListItemIcon,
  ListItemText,
  MenuItem,
  type MenuItemProps,
} from "@mui/material";
import { Place as PlaceIcon } from "@mui/icons-material";
import type { PlaceBasic } from "@/store/types/places";

interface PlaceMenuItemProps extends MenuItemProps {
  place: PlaceBasic;
}

const PlaceMenuItem = ({ place, ...props }: PlaceMenuItemProps) => {
  return (
    <MenuItem {...props}>
      <ListItemIcon>
        <PlaceIcon />
      </ListItemIcon>
      <ListItemText
        primary={place.address_short}
        secondary={`${place.city}, ${place.state}`}
      />
    </MenuItem>
  );
};

export default PlaceMenuItem;
