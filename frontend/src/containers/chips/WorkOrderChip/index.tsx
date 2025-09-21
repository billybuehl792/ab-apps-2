import { Chip, Skeleton, type ChipProps } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { Work } from "@mui/icons-material";
import { workOrderQueries } from "@/store/queries/work-orders";
import type { WorkOrder } from "@/store/types/work-orders";

interface WorkOrderChipProps extends ChipProps {
  workOrder: WithRequired<WorkOrder, "id" | "label"> | WorkOrder["id"];
}

const DEFAULT_LABEL = "-";

const WorkOrderChip = ({
  workOrder: workOrderProp,
  ...props
}: WorkOrderChipProps) => {
  /** Values */

  const isId = !(workOrderProp instanceof Object);
  const workOrderId = isId ? workOrderProp : workOrderProp.id;

  /** Queries */

  const workOrderQuery = useQuery({
    ...workOrderQueries.detail(workOrderId),
    enabled: isId,
  });

  /** Data */

  const workOrder = isId ? workOrderQuery.data : workOrderProp;
  const label = workOrderQuery.isError
    ? "error"
    : (workOrder?.label ?? DEFAULT_LABEL);

  return (
    <Chip
      icon={<Work />}
      label={
        workOrderQuery.isLoading ? <Skeleton height={24} width={100} /> : label
      }
      {...props}
    />
  );
};

export default WorkOrderChip;
