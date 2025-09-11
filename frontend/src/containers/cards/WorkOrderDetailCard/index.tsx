import { type ComponentProps } from "react";
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
import WorkOrderClientFormChip from "@/containers/chips/WorkOrderClientFormChip";
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

  const items: ComponentProps<typeof Metadata>["items"] = [
    {
      id: "location",
      label: "Location",
      value: workOrder.place?.address_full ?? "None",
    },
    {
      id: "client",
      label: "Client",
      value: (
        <WorkOrderClientFormChip
          workOrder={workOrder}
          variant="outlined"
          size="xs"
        />
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
        <Stack spacing={1}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="h6">{workOrder.label}</Typography>
            <WorkOrderStatusChip workOrder={workOrder} size="small" />
          </Stack>
          <Metadata
            items={items}
            spacing={0.5}
            slotProps={{
              label: { variant: "body2" },
              value: { variant: "body2" },
            }}
          />
        </Stack>
        <Metadata items={metadata} />
      </CardContent>
    </Card>
  );
};

export default WorkOrderDetailCard;
