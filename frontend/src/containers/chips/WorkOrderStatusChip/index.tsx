import { Chip, type ChipProps } from "@mui/material";
import type { WorkOrder } from "@/store/types";

interface WorkOrderStatusChip extends ChipProps {
  workOrder: WorkOrder;
}

const WorkOrderStatusChip = ({ workOrder, ...props }: WorkOrderStatusChip) => {
  return (
    <Chip
      label={workOrder.status.replace(/_/g, " ").toTitleCase()}
      variant="outlined"
      color={
        workOrder.status === "completed"
          ? "success"
          : workOrder.status === "canceled"
            ? "error"
            : "info"
      }
      {...props}
    />
  );
};

export default WorkOrderStatusChip;
