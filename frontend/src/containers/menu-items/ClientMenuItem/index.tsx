import { useQuery } from "@tanstack/react-query";
import {
  ListItemIcon,
  ListItemText,
  MenuItem,
  type MenuItemProps,
} from "@mui/material";
import { Person } from "@mui/icons-material";
import { clientQueries } from "@/store/queries/clients";
import { type Client } from "@/store/types/clients";

interface ClientMenuItemProps extends MenuItemProps {
  client: WithRequired<Client, "id" | "full_name"> | Client["id"];
}

const ClientMenuItem = ({
  client: clientProp,
  ...props
}: ClientMenuItemProps) => {
  /** Values */

  const isId = typeof clientProp !== "object";
  const clientId = isId ? clientProp : clientProp.id;

  /** Queries */

  const clientQuery = useQuery({
    ...clientQueries.detail(clientId),
    enabled: isId,
  });

  /** Data */

  const client = isId ? clientQuery.data : clientProp;
  const fullname = client ? client.full_name : "-";

  return (
    <MenuItem {...props}>
      <ListItemIcon>
        <Person />
      </ListItemIcon>
      <ListItemText primary={fullname} secondary={client?.email ?? "-"} />
    </MenuItem>
  );
};

export default ClientMenuItem;
