import { Chip, type ChipProps } from "@mui/material";
import { WorkOrderStatus } from "@/store/enums/work-orders";
import type { WorkOrderBasic } from "@/store/types/work-orders";

interface WorkOrderStatusChip extends ChipProps {
  workOrder: WorkOrderBasic;
  status: WorkOrderStatus;
}

const WorkOrderStatusChip = ({
  workOrder,
  status: statusProp,
  ...props
}: RequireAtLeastOne<WorkOrderStatusChip, "workOrder" | "status">) => {
  /** Values */

  const status = workOrder?.status ?? statusProp ?? WorkOrderStatus.New;
  const color =
    status === WorkOrderStatus.InProgress
      ? "info"
      : status === WorkOrderStatus.Completed
        ? "success"
        : status === WorkOrderStatus.Canceled
          ? "error"
          : "default";

  return (
    <Chip label={status.snakeCaseToTitleCase()} color={color} {...props} />
  );
};

export default WorkOrderStatusChip;
