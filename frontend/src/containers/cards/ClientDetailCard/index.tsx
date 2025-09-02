import {
  Card,
  CardContent,
  Stack,
  Typography,
  type CardProps,
} from "@mui/material";
import type { Client } from "@/store/types";

interface ClientDetailCardProps extends CardProps {
  client: Client;
}

const ClientDetailCard = ({ client, ...props }: ClientDetailCardProps) => {
  /** Values */

  const fullName = `${client.first_name} ${client.last_name}`;

  return (
    <Card variant="outlined" {...props}>
      <CardContent component={Stack}>
        <Typography variant="h6">{fullName}</Typography>
        <Typography variant="caption">Email: {client.email}</Typography>
        <Typography variant="caption">
          Phone: {client.phone_primary.toPhone()}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ClientDetailCard;
