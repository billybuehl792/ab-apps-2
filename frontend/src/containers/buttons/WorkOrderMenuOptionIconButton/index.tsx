import { type ComponentProps } from "react";
import { useQuery } from "@tanstack/react-query";
import { workOrderQueries } from "@/store/queries/work-orders";
import useWorkOrder from "@/store/hooks/useWorkOrder";
import MenuOptionIconButton from "@/components/buttons/MenuOptionIconButton";
import { WorkOrderOptionId } from "@/store/enums/work-orders";
import type { WorkOrderBasic } from "@/store/types/work-orders";

interface WorkOrderMenuOptionIconButtonProps
  extends Omit<ComponentProps<typeof MenuOptionIconButton>, "options"> {
  workOrder: WorkOrderBasic | number;
  hideOptions?: WorkOrderOptionId[];
}

const WorkOrderMenuOptionIconButton = ({
  workOrder: workOrderProp,
  hideOptions,
  ...props
}: WorkOrderMenuOptionIconButtonProps) => {
  /** Values */

  const { workOrder, options } = useWorkOrder(workOrderProp);
  const isId = typeof workOrderProp === "number";
  const workOrderId = isId ? workOrderProp : workOrderProp.id;

  /** Queries */

  const workOrderQuery = useQuery({
    ...workOrderQueries.detail(workOrderId),
    enabled: isId,
  });

  return (
    <MenuOptionIconButton
      title={workOrder?.label ?? "Work Order"}
      disabled={isId && !workOrderQuery.isSuccess}
      options={options.filter((option) => !hideOptions?.includes(option.id))}
      {...props}
    />
  );
};

export default WorkOrderMenuOptionIconButton;
