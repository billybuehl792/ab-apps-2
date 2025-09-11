import { type ComponentProps } from "react";
import { type AxiosResponse } from "axios";
import Form from "@/components/forms/Form";
import WorkOrderFormLabelField from "./fields/WorkOrderFormLabelField";
import WorkOrderFormDescriptionField from "./fields/WorkOrderFormDescriptionField";
import WorkOrderFormCostField from "./fields/WorkOrderFormCostField";
import WorkOrderFormStatusField from "./fields/WorkOrderFormStatusField";
import WorkOrderFormClientField from "./fields/WorkOrderFormClientField";
import WorkOrderFormPlaceField from "./fields/WorkOrderFormPlaceField";
import type { WorkOrder, WriteableWorkOrder } from "@/store/types/work-orders";

export type WorkOrderFormValues = Omit<WorkOrder, "id">;

const WorkOrderForm = (
  props: ComponentProps<
    typeof Form<WorkOrderFormValues, AxiosResponse<WriteableWorkOrder>>
  >
) => {
  return (
    <Form {...props}>
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
