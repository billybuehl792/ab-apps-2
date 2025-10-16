import { type ComponentProps } from "react";
import {
  Card,
  CardActions,
  CardContent,
  Stack,
  Typography,
  type CardProps,
} from "@mui/material";
import CardActionAreaLink from "@/components/links/CardActionAreaLink";
import ClientMenuOptionIconButton from "@/containers/buttons/ClientMenuOptionIconButton";
import Metadata from "@/components/lists/Metadata";
import { ClientIcons } from "@/store/constants/clients";
import type { Client } from "@/store/types/clients";

interface ClientListCardProps extends CardProps {
  client: Client;
}

const ClientListCard = ({ client, ...props }: ClientListCardProps) => {
  /** Values */

  const items: ComponentProps<typeof Metadata>["items"] = [
    {
      id: "email",
      label: "Email",
      value: client.email ?? "None",
    },
    {
      id: "address",
      label: "Address",
      value: client.place?.address_short ?? "None",
    },
    {
      id: "workOrders",
      label: "Work Orders",
      render: Boolean(client.work_orders_count),
      value: String(client.work_orders_count),
    },
  ];

  return (
    <Stack component={Card} position="relative" {...props}>
      <CardActionAreaLink
        to="/app/dashboard/clients/$id"
        params={{ id: String(client.id) }}
      >
        <CardContent
          component={Stack}
          direction="row"
          spacing={2}
          alignItems="center"
          mr={6}
        >
          <ClientIcons.Detail fontSize="large" color="disabled" />
          <Stack spacing={0.5} overflow="hidden">
            <Typography variant="body1" noWrap>
              {client.full_name}
            </Typography>
            <Metadata items={items} />
          </Stack>
        </CardContent>
      </CardActionAreaLink>
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
