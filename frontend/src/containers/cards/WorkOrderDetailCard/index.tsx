import {
  Card,
  CardContent,
  Stack,
  Typography,
  type CardProps,
} from "@mui/material";
import type { WorkOrder } from "@/store/types";

interface WorkOrderDetailCardProps extends CardProps {
  workOrder: WorkOrder;
}

const WorkOrderDetailCard = ({
  workOrder,
  ...props
}: WorkOrderDetailCardProps) => {
  return (
    <Card variant="outlined" {...props}>
      <CardContent component={Stack}>
        <Typography variant="h6">{workOrder.label}</Typography>
        <Typography variant="caption">Status: {workOrder.status}</Typography>
        <Typography variant="caption">
          Scheduled Date: {workOrder.scheduled_date}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default WorkOrderDetailCard;
