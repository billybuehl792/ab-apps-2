import { type ComponentProps } from "react";
import { type AxiosResponse } from "axios";
import Form from "@/components/forms/Form";
import WorkOrderLabelField from "./fields/WorkOrderLabelField";
import WorkOrderClientField from "./fields/WorkOrderClientField";
import type { WorkOrder } from "@/store/types";

export type WorkOrderForm = Omit<WorkOrder, "id">;

const WorkOrderForm = (
  props: ComponentProps<typeof Form<WorkOrderForm, AxiosResponse<WorkOrder>>>
) => {
  return (
    <Form {...props}>
      <WorkOrderLabelField />
      <WorkOrderClientField />
    </Form>
  );
};

export default WorkOrderForm;
