import { type ComponentProps } from "react";
import Form from "@/components/forms/Form";
import WorkOrderFormLabelField from "./fields/WorkOrderFormLabelField";
import WorkOrderFormDescriptionField from "./fields/WorkOrderFormDescriptionField";
import WorkOrderFormCostField from "./fields/WorkOrderFormCostField";
import WorkOrderFormStatusField from "./fields/WorkOrderFormStatusField";
import WorkOrderFormClientField from "./fields/WorkOrderFormClientField";
import WorkOrderFormPlaceField from "./fields/WorkOrderFormPlaceField";
import { WorkOrderStatus } from "@/store/enums/work-orders";
import type { WorkOrder } from "@/store/types/work-orders";

export type WorkOrderFormValues = Omit<WorkOrder, "id">;

type WorkOrderFormProps<T = void> = Omit<
  ComponentProps<typeof Form<WorkOrderFormValues, T>>,
  "children"
>;

const WorkOrderForm = <T,>({
  defaultValues,
  ...props
}: WorkOrderFormProps<T>) => {
  return (
    <Form
      defaultValues={{ status: WorkOrderStatus.New, ...defaultValues }}
      {...props}
    >
      <WorkOrderFormLabelField />
      <WorkOrderFormDescriptionField />
      <WorkOrderFormCostField />
      <WorkOrderFormStatusField />
      <WorkOrderFormPlaceField />
      <WorkOrderFormClientField />
    </Form>
  );
};

export default WorkOrderForm;
