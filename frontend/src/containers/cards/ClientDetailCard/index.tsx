import { type ComponentProps } from "react";
import {
  Card,
  CardContent,
  Stack,
  Typography,
  type CardProps,
} from "@mui/material";
import dayjs from "dayjs";
import Metadata from "@/components/lists/Metadata";
import { DateTimeFormat } from "@/store/enums/datetime";
import type { Client } from "@/store/types";

interface ClientDetailCardProps extends CardProps {
  client: Client;
}

const ClientDetailCard = ({ client, ...props }: ClientDetailCardProps) => {
  /** Values */

  const fullName = `${client.first_name} ${client.last_name}`;

  const metadata: ComponentProps<typeof Metadata>["items"] = [
    {
      id: "email",
      label: "Email",
      value: client.email,
    },
    {
      id: "phone",
      label: "Phone",
      value: client.phone_primary.toPhone(),
    },
    {
      id: "created",
      label: "Created",
      value: dayjs(client.created_at).format(DateTimeFormat.DATETIME_MERIDIEM),
    },
  ];

  return (
    <Card variant="outlined" {...props}>
      <CardContent component={Stack} spacing={1}>
        <Typography variant="h6">{fullName}</Typography>
        <Metadata items={metadata} />
      </CardContent>
    </Card>
  );
};

export default ClientDetailCard;
