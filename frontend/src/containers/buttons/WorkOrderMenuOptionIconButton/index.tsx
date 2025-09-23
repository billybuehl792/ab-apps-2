import { type ComponentProps } from "react";
import MenuOptionIconButton from "@/components/buttons/MenuOptionIconButton";
import useWorkOrder from "@/store/hooks/useWorkOrder";
import type { WorkOrderBasic } from "@/store/types/work-orders";

interface WorkOrderMenuOptionIconButtonProps
  extends Omit<ComponentProps<typeof MenuOptionIconButton>, "options"> {
  workOrder: WorkOrderBasic | number;
  renderOptions?: (
    options: ReturnType<typeof useWorkOrder>["options"]
  ) => ReturnType<typeof useWorkOrder>["options"];
}

const WorkOrderMenuOptionIconButton = ({
  workOrder: workOrderProp,
  renderOptions,
  ...props
}: WorkOrderMenuOptionIconButtonProps) => {
  /** Values */

  const { workOrder, options } = useWorkOrder(workOrderProp);

  return (
    <MenuOptionIconButton
      title={workOrder?.label ?? "Work Order"}
      options={renderOptions?.(options) ?? options}
      {...props}
    />
  );
};

export default WorkOrderMenuOptionIconButton;
