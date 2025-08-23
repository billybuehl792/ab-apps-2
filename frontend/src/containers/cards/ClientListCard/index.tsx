import { Link } from "@tanstack/react-router";
import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  type CardProps,
} from "@mui/material";
import type { Client } from "@/store/types";

interface ClientListCardProps extends CardProps {
  client: Client;
}

const ClientListCard = ({ client, ...props }: ClientListCardProps) => {
  /** Values */

  const fullName = `${client.first_name} ${client.last_name}`;

  return (
    <Card variant="outlined" {...props}>
      <CardActionArea LinkComponent={Link} href={`/app/clients/${client.id}`}>
        <CardContent>
          <Typography variant="h6">{fullName}</Typography>
          <Typography variant="body2">{client.email}</Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ClientListCard;
