import { type ComponentProps } from "react";
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

  return (
    <MenuOptionIconButton
      title={workOrder?.label ?? "Work Order"}
      options={options.filter((option) => !hideOptions?.includes(option.id))}
      {...props}
    />
  );
};

export default WorkOrderMenuOptionIconButton;
