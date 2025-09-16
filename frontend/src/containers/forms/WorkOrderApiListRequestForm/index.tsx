import { type ComponentProps } from "react";
import { Stack } from "@mui/material";
import Form from "@/components/forms/Form";
import WorkOrderApiListRequestFormOrderingHead from "./layout/WorkOrderApiListRequestFormOrderingHead";
import WorkOrderApiListRequestFormFiltersHead from "./layout/WorkOrderApiListRequestFormFiltersHead";
import WorkOrderApiListRequestFormOrderingField from "./fields/WorkOrderApiListRequestFormOrderingField";
import WorkOrderApiListRequestFormStatusField from "./fields/WorkOrderApiListRequestFormStatusField";
import WorkOrderApiListRequestFormClientField from "./fields/WorkOrderApiListRequestFormClientField";
import WorkOrderApiListRequestFormCityField from "./fields/WorkOrderApiListRequestFormCityField";
import type { WorkOrderApiListRequest } from "@/store/types/work-orders";

export type WorkOrderApiListRequestFormValues = WorkOrderApiListRequest;

const WorkOrderApiListRequestForm = (
  props: ComponentProps<typeof Form<WorkOrderApiListRequestFormValues>>
) => {
  return (
    <Form {...props}>
      <Stack px={2}>
        {/* Ordering */}
        <WorkOrderApiListRequestFormOrderingHead />
        <Stack spacing={2} py={1}>
          <WorkOrderApiListRequestFormOrderingField />
        </Stack>

        {/* Filters */}
        <WorkOrderApiListRequestFormFiltersHead />
        <Stack spacing={2} py={3}>
          <WorkOrderApiListRequestFormStatusField />
          <WorkOrderApiListRequestFormCityField />
          <WorkOrderApiListRequestFormClientField />
        </Stack>
      </Stack>
    </Form>
  );
};

export default WorkOrderApiListRequestForm;
