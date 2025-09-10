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

  const metadata: ComponentProps<typeof Metadata>["items"] = [
    {
      id: "scheduled",
      label: "Scheduled Date",
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
          <Stack spacing={0.5}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="body2" color="text.secondary">
                Location:
              </Typography>
              <Typography
                variant="body2"
                color={workOrder.place ? "text.primary" : "text.disabled"}
              >
                {workOrder.place?.address_full ?? "None"}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="body2" color="text.secondary">
                Client:
              </Typography>
              <WorkOrderClientFormChip
                workOrder={workOrder}
                variant="outlined"
                size="xs"
              />
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="body2" color="text.secondary">
                Cost:
              </Typography>
              <Typography
                variant="body2"
                color={
                  workOrder.cost !== null ? "text.primary" : "text.disabled"
                }
              >
                {Number(workOrder.cost).toUSD()}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
        <Metadata items={metadata} />
      </CardContent>
    </Card>
  );
};

export default WorkOrderDetailCard;
