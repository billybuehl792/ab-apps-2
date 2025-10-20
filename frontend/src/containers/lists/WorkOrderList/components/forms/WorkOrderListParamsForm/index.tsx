import { type ComponentProps } from "react";
import { Stack } from "@mui/material";
import Form from "@/components/forms/Form";
import WorkOrderListParamsFormOrderingHead from "./layout/WorkOrderListParamsFormOrderingHead";
import WorkOrderListParamsFormFiltersHead from "./layout/WorkOrderListParamsFormFiltersHead";
import WorkOrderListParamsFormOrderingField from "./fields/WorkOrderListParamsFormOrderingField";
import WorkOrderListParamsFormStatusesField from "./fields/WorkOrderListParamsFormStatusesField";
import WorkOrderListParamsFormClientsField from "./fields/WorkOrderListParamsFormClientsField";
import WorkOrderListParamsFormCitiesField from "./fields/WorkOrderListParamsFormCitiesField";
import {
  WorkOrderListRequestParamsOrdering,
  WorkOrderStatus,
} from "@/store/enums/work-orders";
import type { Client } from "@/store/types/clients";

export type WorkOrderListParamsFormValues = {
  ordering: WorkOrderListRequestParamsOrdering | null;
  statuses: WorkOrderStatus[];
  cities: string[];
  clients: Client[];
};

interface WorkOrderListParamsFormProps
  extends Omit<
    ComponentProps<typeof Form<WorkOrderListParamsFormValues>>,
    "renderFields"
  > {
  hideFields?: Set<keyof WorkOrderListParamsFormValues>;
}

const WorkOrderListParamsForm = ({
  hideFields,
  ...props
}: WorkOrderListParamsFormProps) => {
  return (
    <Form
      defaultValues={{
        ordering: null,
        statuses: [],
        cities: [],
        clients: [],
      }}
      resetOptions={{ keepDefaultValues: true }}
      renderFields={() => (
        <>
          {!hideFields?.has("ordering") && (
            <>
              <WorkOrderListParamsFormOrderingHead />
              <WorkOrderListParamsFormOrderingField />
            </>
          )}

          <WorkOrderListParamsFormFiltersHead />
          <Stack spacing={2}>
            <WorkOrderListParamsFormStatusesField />
            <WorkOrderListParamsFormCitiesField />
            <WorkOrderListParamsFormClientsField />
          </Stack>
        </>
      )}
      {...props}
    />
  );
};

export default WorkOrderListParamsForm;
