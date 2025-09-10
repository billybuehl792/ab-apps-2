import { type ComponentProps } from "react";
import { type AxiosResponse } from "axios";
import Form from "@/components/forms/Form";
import WorkOrderClientFormClientField from "./fields/WorkOrderClientFormClientField";
import type { WorkOrder, WriteableWorkOrder } from "@/store/types/work-orders";

export type WorkOrderClientFormValues = {
  client: WorkOrder["client"] | null;
};

const WorkOrderClientForm = (
  props: ComponentProps<
    typeof Form<WorkOrderClientFormValues, AxiosResponse<WriteableWorkOrder>>
  >
) => {
  return (
    <Form {...props}>
      <WorkOrderClientFormClientField />
    </Form>
  );
};

export default WorkOrderClientForm;
