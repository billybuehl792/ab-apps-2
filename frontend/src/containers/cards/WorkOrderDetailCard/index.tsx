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
import ClientChip from "@/containers/chips/ClientChip";
import WorkOrderStatusChip from "@/containers/chips/WorkOrderStatusChip";
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

  const metadata: ComponentProps<typeof Metadata>["items"] = [
    {
      id: "scheduled",
      label: "Scheduled Date",
      value: dayjs(workOrder.scheduled_date).format(
        DateTimeFormat.DATETIME_MERIDIEM
      ),
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
          {!!workOrder.client && (
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="body2">Client:</Typography>
              <ClientChip client={workOrder.client} size="small" />
            </Stack>
          )}
        </Stack>
        <Metadata items={metadata} />
      </CardContent>
    </Card>
  );
};

export default WorkOrderDetailCard;
