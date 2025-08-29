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
import WorkOrderMenuOptionIconButton from "@/containers/buttons/WorkOrderMenuOptionIconButton";
import type { WorkOrder } from "@/store/types";

interface WorkOrderListCardProps extends CardProps {
  workOrder: WorkOrder;
}

const WorkOrderListCard = ({ workOrder, ...props }: WorkOrderListCardProps) => {
  return (
    <Stack component={Card} position="relative" {...props}>
      <CardActionArea
        LinkComponent={Link}
        href={`/app/work-orders/${workOrder.id}`}
      >
        <CardContent component={Stack} mr={7.5}>
          <Typography variant="h6" noWrap>
            {workOrder.label}
          </Typography>
          <Typography variant="body2" noWrap>
            {workOrder.status}
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
        <WorkOrderMenuOptionIconButton
          workOrder={workOrder}
          sx={{ pointerEvents: "auto" }}
        />
      </CardActions>
    </Stack>
  );
};

export default WorkOrderListCard;
