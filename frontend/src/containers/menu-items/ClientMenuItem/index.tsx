import { useQuery } from "@tanstack/react-query";
import {
  ListItemIcon,
  ListItemText,
  MenuItem,
  type MenuItemProps,
} from "@mui/material";
import { Person } from "@mui/icons-material";
import type { TClientBasic } from "@/store/types/clients";
import { clientEndpoints } from "@/store/constants/clients";

interface ClientMenuItemProps extends MenuItemProps {
  client: TClientBasic | TClientBasic["id"];
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
    queryKey: clientEndpoints.client(clientId).id,
    queryFn: clientEndpoints.client(clientId).get,
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
