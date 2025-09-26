import { type ComponentProps } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
  type CardProps,
} from "@mui/material";
import dayjs from "dayjs";
import Metadata from "@/components/lists/Metadata";
import WorkOrderStatusChip from "@/containers/chips/WorkOrderStatusChip";
import ClientChip from "@/containers/chips/ClientChip";
import { DateTimeFormat } from "@/store/enums/datetime";
import type { WorkOrder } from "@/store/types/work-orders";

interface WorkOrderDetailCardProps extends CardProps {
  workOrder: WorkOrder;
}

const WorkOrderDetailCard = ({
  workOrder,
  ...props
}: WorkOrderDetailCardProps) => {
  /** Values */

  const navigate = useNavigate();

  /** Callbacks */

  const handleNavigateClient = () => {
    if (!workOrder.client) return;
    navigate({
      to: "/app/dashboard/clients/$id",
      params: { id: String(workOrder.client.id) },
    });
  };

  /** Options */

  const items: ComponentProps<typeof Metadata>["items"] = [
    {
      id: "location",
      label: "Location",
      value: workOrder.place?.address_short ?? "None",
    },
    {
      id: "client",
      label: "Client",
      value: workOrder.client ? (
        <ClientChip
          client={workOrder.client}
          variant="outlined"
          size="xs"
          onClick={handleNavigateClient}
        />
      ) : (
        "None"
      ),
    },
    {
      id: "cost",
      label: "Cost",
      value: Number(workOrder.cost).toUSD(),
    },
  ];

  const metadata: ComponentProps<typeof Metadata>["items"] = [
    {
      id: "scheduled",
      label: "Scheduled",
      value: workOrder.scheduled_date
        ? dayjs(workOrder.scheduled_date).format(
            DateTimeFormat.DATETIME_MERIDIEM
          )
        : "-",
    },
    {
      id: "created",
      label: "Created",
      value: dayjs(workOrder.created_at).format(
        DateTimeFormat.DATETIME_MERIDIEM
      ),
    },
    {
      id: "updated",
      label: "Updated",
      value: dayjs(workOrder.updated_at).format(
        DateTimeFormat.DATETIME_MERIDIEM
      ),
    },
  ];

  return (
    <Card variant="outlined" {...props}>
      <CardContent
        component={Stack}
        spacing={2}
        divider={<Divider variant="middle" />}
      >
        <Stack spacing={2}>
          <Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="h6">{workOrder.label}</Typography>
              <WorkOrderStatusChip workOrder={workOrder} size="small" />
            </Stack>
            {!!workOrder.description && (
              <Typography variant="body2" color="text.secondary">
                {workOrder.description}
              </Typography>
            )}
          </Stack>
          <Metadata items={items} />
        </Stack>
        <Metadata items={metadata} />
      </CardContent>
    </Card>
  );
};

export default WorkOrderDetailCard;
