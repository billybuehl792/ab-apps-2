import {
  ListItemIcon,
  ListItemText,
  MenuItem,
  type MenuItemProps,
} from "@mui/material";
import { Person } from "@mui/icons-material";
import { type Client } from "@/store/types/clients";

interface ClientMenuItemProps extends MenuItemProps {
  client: Client;
}

const ClientMenuItem = ({ client, ...props }: ClientMenuItemProps) => {
  /** Values */

  const fullname = `${client.first_name} ${client.last_name}`;

  return (
    <MenuItem {...props}>
      <ListItemIcon>
        <Person />
      </ListItemIcon>
      <ListItemText primary={fullname} secondary={client.email} />
    </MenuItem>
  );
};

export default ClientMenuItem;
