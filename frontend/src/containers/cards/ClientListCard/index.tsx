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
import Metadata from "@/components/lists/Metadata";
import { ComponentProps } from "react";
import WorkOrderChip from "@/containers/chips/WorkOrderChip";

interface ClientListCardProps extends CardProps {
  client: Client;
}

const ClientListCard = ({ client, ...props }: ClientListCardProps) => {
  /** Values */

  const fullName = `${client.first_name} ${client.last_name}`;

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
      render: Boolean(client.work_orders.length),
      value: (
        <Stack spacing={0.5} direction="row" useFlexGap flexWrap="wrap">
          {client.work_orders.map((workOrder) => (
            <WorkOrderChip
              key={workOrder.id}
              workOrder={workOrder}
              size="xxs"
              variant="outlined"
            />
          ))}
        </Stack>
      ),
    },
  ];

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
          <Stack spacing={0.5} overflow="hidden">
            <Typography variant="body1" noWrap>
              {fullName}
            </Typography>
            <Metadata items={items} />
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
