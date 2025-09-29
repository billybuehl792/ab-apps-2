import { type ComponentProps } from "react";
import {
  Card,
  CardActions,
  CardContent,
  Stack,
  Typography,
  type CardProps,
} from "@mui/material";
import CardActionAreaLink from "@/components/links/CardActionAreaLink";
import Metadata from "@/components/lists/Metadata";
import WorkOrderMenuOptionIconButton from "@/containers/buttons/WorkOrderMenuOptionIconButton";
import WorkOrderStatusChip from "@/containers/chips/WorkOrderStatusChip";
import ClientChip from "@/containers/chips/ClientChip";
import { WorkOrderIcons } from "@/store/constants/work-orders";
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
      <CardActionAreaLink
        to="/app/dashboard/work-orders/$id"
        params={{ id: String(workOrder.id) }}
      >
        <CardContent
          component={Stack}
          direction="row"
          spacing={2}
          alignItems="center"
          mr={6}
        >
          <WorkOrderIcons.Detail fontSize="large" color="disabled" />
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
      </CardActionAreaLink>
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
