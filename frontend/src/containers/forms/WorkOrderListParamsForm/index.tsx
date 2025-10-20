import { type ComponentProps } from "react";
import { Stack } from "@mui/material";
import Form from "@/components/forms/Form";
import WorkOrderListParamsFormOrderingHead from "./layout/WorkOrderListParamsFormOrderingHead";
import WorkOrderListParamsFormFiltersHead from "./layout/WorkOrderListParamsFormFiltersHead";
import WorkOrderListParamsFormOrderingField from "./fields/WorkOrderListParamsFormOrderingField";
import WorkOrderListParamsFormStatusField from "./fields/WorkOrderListParamsFormStatusField";
import WorkOrderListParamsFormClientField from "./fields/WorkOrderListParamsFormClientField";
import WorkOrderListParamsFormCityField from "./fields/WorkOrderListParamsFormCityField";
import {
  WorkOrderListRequestParamsOrdering,
  WorkOrderStatus,
} from "@/store/enums/work-orders";
import type { Client } from "@/store/types/clients";

export type WorkOrderListParamsFormValues = {
  ordering: WorkOrderListRequestParamsOrdering | null;
  statuses: WorkOrderStatus[];
  cities: string[];
  clients: Array<Client>;
};

const WorkOrderListParamsForm = (
  props: ComponentProps<typeof Form<WorkOrderListParamsFormValues>>
) => {
  return (
    <Form {...props}>
      {/* Ordering */}
      <WorkOrderListParamsFormOrderingHead />
      <Stack>
        <WorkOrderListParamsFormOrderingField />
      </Stack>

      {/* Filters */}
      <WorkOrderListParamsFormFiltersHead />
      <Stack spacing={2}>
        <WorkOrderListParamsFormStatusField />
        <WorkOrderListParamsFormCityField />
        <WorkOrderListParamsFormClientField />
      </Stack>
    </Form>
  );
};

export default WorkOrderListParamsForm;
