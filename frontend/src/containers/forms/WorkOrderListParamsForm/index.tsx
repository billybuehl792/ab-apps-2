import { type ReactNode, type FormEventHandler } from "react";
import { FormProvider, useForm, type UseFormProps } from "react-hook-form";
import { Button, Stack, type StackProps } from "@mui/material";
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

export interface WorkOrderListParamsFormValues {
  ordering: WorkOrderListRequestParamsOrdering | null;
  statuses: WorkOrderStatus[];
  clients: Client[];
  cities: string[];
}

interface WorkOrderListParamsFormProps
  extends UseFormProps<WorkOrderListParamsFormValues> {
  /** Disable fields for the given values. Hide these with `hideDisabledFields`. */
  disabledFields?: Array<keyof WorkOrderListParamsFormValues>;
  /** Hide fields `disabledFields` */
  hideDisabledFields?: boolean;
  hideOrdering?: boolean;
  hideFilters?: boolean;
  submitLabel?: ReactNode;
  resetLabel?: ReactNode;
  onSubmit: (data: WorkOrderListParamsFormValues) => void;
  onReset?: () => void;
  slotProps?: {
    container?: StackProps;
    fieldset?: StackProps;
    actions?: StackProps;
  };
}

const WorkOrderListParamsForm = ({
  disabledFields,
  hideDisabledFields,
  hideOrdering,
  hideFilters,
  submitLabel = "Apply",
  resetLabel = "Reset",
  onSubmit,
  onReset,
  slotProps,
  ...props
}: WorkOrderListParamsFormProps) => {
  /** Values */

  const methods = useForm<WorkOrderListParamsFormValues>({
    defaultValues: { ordering: null, statuses: [], clients: [], cities: [] },
    ...props,
  });

  const disableOrdering = disabledFields?.includes("ordering");
  const showOrdering = !hideOrdering && !hideDisabledFields && !disableOrdering;

  const disableStatuses = disabledFields?.includes("statuses");
  const hideStatuses = hideDisabledFields && disableStatuses;

  const disableCities = disabledFields?.includes("cities");
  const hideCities = hideDisabledFields && disableCities;

  const disableClients = disabledFields?.includes("clients");
  const hideClients = hideDisabledFields && disableClients;

  const showFilters =
    !hideFilters && (!hideStatuses || !hideCities || !hideClients);

  /** Callbacks */

  const handleOnSubmit = methods.handleSubmit(onSubmit);

  const handleOnReset: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    methods.reset();
    onReset?.();
  };

  return (
    <FormProvider {...methods}>
      <Stack
        component="form"
        noValidate
        onSubmit={handleOnSubmit}
        onReset={handleOnReset}
        {...slotProps?.container}
      >
        <Stack spacing={1} {...slotProps?.fieldset}>
          {showOrdering && (
            <>
              <WorkOrderListParamsFormOrderingHead disabled={disableOrdering} />
              <WorkOrderListParamsFormOrderingField
                disabled={disableOrdering}
              />
            </>
          )}
          {showFilters && (
            <>
              <WorkOrderListParamsFormFiltersHead />
              <Stack spacing={2}>
                {!hideStatuses && (
                  <WorkOrderListParamsFormStatusesField
                    disabled={disableStatuses}
                  />
                )}
                {!hideCities && (
                  <WorkOrderListParamsFormCitiesField
                    disabled={disableCities}
                  />
                )}
                {!hideClients && (
                  <WorkOrderListParamsFormClientsField
                    disabled={disableClients}
                  />
                )}
              </Stack>
            </>
          )}
        </Stack>
        <Stack direction="row" spacing={1} {...slotProps?.actions}>
          <Button type="reset" color="error">
            {resetLabel}
          </Button>
          <Button type="submit">{submitLabel}</Button>
        </Stack>
      </Stack>
    </FormProvider>
  );
};

export default WorkOrderListParamsForm;
