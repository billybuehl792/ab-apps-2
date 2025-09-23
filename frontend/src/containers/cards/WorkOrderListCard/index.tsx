import { type ComponentProps } from "react";
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
import Metadata from "@/components/lists/Metadata";
import WorkOrderMenuOptionIconButton from "@/containers/buttons/WorkOrderMenuOptionIconButton";
import WorkOrderStatusChip from "@/containers/chips/WorkOrderStatusChip";
import ClientChip from "@/containers/chips/ClientChip";
import type { WorkOrder } from "@/store/types/work-orders";

interface WorkOrderListCardProps extends CardProps {
  workOrder: WorkOrder;
}

const WorkOrderListCard = ({ workOrder, ...props }: WorkOrderListCardProps) => {
  /** Values */

  const items: ComponentProps<typeof Metadata>["items"] = [
    {
      id: "address",
      label: "Address",
      value: workOrder.place?.address_short ?? "None",
    },
    {
      id: "client",
      label: "Client",
      value: workOrder.client ? (
        <ClientChip client={workOrder.client} variant="outlined" size="xxs" />
      ) : (
        "None"
      ),
    },
  ];

  return (
    <Stack component={Card} position="relative" {...props}>
      <Link
        to="/app/work-orders/$id"
        params={{ id: String(workOrder.id) }}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <CardActionArea>
          <CardContent
            component={Stack}
            direction="row"
            spacing={2}
            alignItems="center"
            mr={6}
          >
            <Work fontSize="large" color="disabled" />
            <Stack spacing={0.5} overflow="hidden">
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
              <Metadata items={items} />
            </Stack>
          </CardContent>
        </CardActionArea>
      </Link>
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
