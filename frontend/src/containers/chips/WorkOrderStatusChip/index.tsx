import { Chip, type ChipProps } from "@mui/material";
import { WorkOrderStatus } from "@/store/enums/work-orders";
import type { WorkOrder } from "@/store/types/work-orders";

interface WorkOrderStatusChip extends ChipProps {
  workOrder: WorkOrder;
}

const WorkOrderStatusChip = ({ workOrder, ...props }: WorkOrderStatusChip) => {
  return (
    <Chip
      label={workOrder.status.snakeCaseToTitleCase()}
      color={
        workOrder.status === WorkOrderStatus.Completed
          ? "success"
          : workOrder.status === WorkOrderStatus.Canceled
            ? "error"
            : "info"
      }
      {...props}
    />
  );
};

export default WorkOrderStatusChip;
