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
import { Work } from "@mui/icons-material";
import WorkOrderMenuOptionIconButton from "@/containers/buttons/WorkOrderMenuOptionIconButton";
import WorkOrderStatusChip from "@/containers/chips/WorkOrderStatusChip";
import type { WorkOrder } from "@/store/types/work-orders";
import ClientChip from "@/containers/chips/ClientChip";

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
        <CardContent
          component={Stack}
          direction="row"
          spacing={2}
          alignItems="center"
          mr={7.5}
        >
          <Work fontSize="large" color="disabled" />
          <Stack>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              overflow="hidden"
            >
              <Typography variant="body1" noWrap>
                {workOrder.label}
              </Typography>
              <WorkOrderStatusChip workOrder={workOrder} size="small" />
            </Stack>
            {!!workOrder.client && (
              <Stack direction="row">
                <ClientChip client={workOrder.client} size="small" />
              </Stack>
            )}
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
        <WorkOrderMenuOptionIconButton
          workOrder={workOrder}
          sx={{ pointerEvents: "auto" }}
        />
      </CardActions>
    </Stack>
  );
};

export default WorkOrderListCard;
