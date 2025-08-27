import { Link } from "@tanstack/react-router";
import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Stack,
  Typography,
  type CardProps,
} from "@mui/material";
import ClientMenuOptionIconButton from "@/containers/buttons/ClientMenuOptionIconButton";
import type { Client } from "@/store/types";

interface ClientListCardProps extends CardProps {
  client: Client;
}

const ClientListCard = ({ client, ...props }: ClientListCardProps) => {
  /** Values */

  const fullName = `${client.first_name} ${client.last_name}`;

  return (
    <Stack component={Card} position="relative" {...props}>
      <CardActionArea LinkComponent={Link} href={`/app/clients/${client.id}`}>
        <CardContent component={Stack} mr={7.5}>
          <Typography variant="h6" noWrap>
            {fullName}
          </Typography>
          <Typography variant="body2" noWrap>
            {client.email}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions
        sx={{
          position: "absolute",
          top: 0,
          bottom: 0,
          right: 0,
          pointerEvents: "none",
        }}
      >
        <ClientMenuOptionIconButton
          client={client}
          sx={{ pointerEvents: "auto" }}
        />
      </CardActions>
    </Stack>
  );
};

export default ClientListCard;
