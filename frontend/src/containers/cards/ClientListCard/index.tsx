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
import { Person } from "@mui/icons-material";
import ClientMenuOptionIconButton from "@/containers/buttons/ClientMenuOptionIconButton";
import type { Client } from "@/store/types/clients";

interface ClientListCardProps extends CardProps {
  client: Client;
}

const ClientListCard = ({ client, ...props }: ClientListCardProps) => {
  /** Values */

  const fullName = `${client.first_name} ${client.last_name}`;

  return (
    <Stack component={Card} position="relative" {...props}>
      <CardActionArea LinkComponent={Link} href={`/app/clients/${client.id}`}>
        <CardContent
          component={Stack}
          direction="row"
          spacing={2}
          alignItems="center"
          mr={7.5}
        >
          <Person fontSize="large" color="disabled" />
          <Stack overflow="hidden">
            <Typography variant="body1" noWrap>
              {fullName}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {client.email}
            </Typography>
          </Stack>
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
